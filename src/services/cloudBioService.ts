import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { AnalyticsData, UserProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/presets';
import { PRESET_THEMES } from '../data/themes';

// Validation synchronicity constants matching firebase-blueprint.json
export const HANDLE_REGEX = /^[a-z0-9_-]+$/;
export const MAX_HANDLE_LENGTH = 40;
export const MIN_HANDLE_LENGTH = 2;

export function sanitizeHandle(raw: string): string {
  const cleaned = (raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, MAX_HANDLE_LENGTH);
  if (cleaned.length >= MIN_HANDLE_LENGTH) return cleaned;
  return `user_${Math.random().toString(36).slice(2, 6)}`;
}

function clampStr(val: string | undefined, maxLen: number): string {
  return (val || '').slice(0, maxLen);
}

function buildSanitizedProfilePayload(
  uid: string,
  username: string,
  profile: UserProfile,
  published: boolean
) {
  const cleanSocials = (profile.socials || []).slice(0, 20).map((s) => ({
    id: clampStr(s.id, 60),
    platform: s.platform,
    url: clampStr(s.url, 500),
    active: Boolean(s.active),
    label: clampStr(s.label, 50),
  }));

  const cleanLinks = (profile.links || []).slice(0, 50).map((l) => ({
    id: clampStr(l.id, 60),
    title: clampStr(l.title, 120),
    subtitle: clampStr(l.subtitle, 160),
    url: clampStr(l.url, 500),
    active: Boolean(l.active),
    icon: clampStr(l.icon || '🔗', 16),
    highlight: Boolean(l.highlight),
    animation: l.animation || 'none',
    clicks: typeof l.clicks === 'number' ? l.clicks : 0,
    badge: clampStr(l.badge, 40),
    category: clampStr(l.category, 40),
  }));

  // Keep only the 15 ThemeConfig keys (within rules limit <= 25)
  const t = profile.theme;
  const cleanTheme = {
    id: clampStr(t.id, 60),
    name: clampStr(t.name, 60),
    description: clampStr(t.description, 120),
    backgroundType: t.backgroundType,
    bgGradient: clampStr(t.bgGradient, 160),
    pageBgColor: clampStr(t.pageBgColor, 32),
    cardBg: clampStr(t.cardBg, 160),
    cardBorder: clampStr(t.cardBorder, 160),
    cardTextColor: clampStr(t.cardTextColor, 100),
    cardSubtextColor: clampStr(t.cardSubtextColor, 100),
    cardRadius: t.cardRadius,
    cardStyle: t.cardStyle,
    nameColor: clampStr(t.nameColor, 80),
    bioColor: clampStr(t.bioColor, 80),
    accentColor: clampStr(t.accentColor, 32),
    fontFamily: t.fontFamily,
    previewBg: clampStr(t.previewBg, 160),
  };

  // Keep only WidgetSettings keys (within rules limit <= 20)
  const w = profile.widgets;
  const cleanWidgets = {
    showContactForm: Boolean(w.showContactForm),
    contactEmail: clampStr(w.contactEmail, 256),
    showCoffeeButton: Boolean(w.showCoffeeButton),
    coffeeUsername: clampStr(w.coffeeUsername, 60),
    coffeeLabel: clampStr(w.coffeeLabel, 80),
    youtubeUrl: clampStr(w.youtubeUrl, 300),
    spotifyUrl: clampStr(w.spotifyUrl, 300),
    customFooterText: clampStr(w.customFooterText, 120),
    showShareButton: Boolean(w.showShareButton),
    showQRCodeButton: Boolean(w.showQRCodeButton),
    showVCardDownload: Boolean(w.showVCardDownload),
  };

  return {
    ownerId: uid,
    username,
    displayName: clampStr(profile.displayName || 'Creator', 100),
    bio: clampStr(profile.bio, 300),
    location: clampStr(profile.location, 100),
    pronouns: clampStr(profile.pronouns, 40),
    avatarUrl: clampStr(profile.avatarUrl, 1000),
    bannerUrl: clampStr(profile.bannerUrl, 1000),
    isVerified: Boolean(profile.isVerified),
    badgeText: clampStr(profile.badgeText, 50),
    socials: cleanSocials,
    links: cleanLinks,
    theme: cleanTheme,
    widgets: cleanWidgets,
    published,
  };
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutCreator() {
  return signOut(auth);
}

function makeEmptyAnalytics(): AnalyticsData {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = new Date().getDay();
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const idx = (todayIdx - 6 + i + 7) % 7;
    return { date: days[idx], views: 0, clicks: 0 };
  });
  return {
    views: 0,
    totalClicks: 0,
    dailyStats,
    referrerStats: [],
    deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
  };
}

function docToUserProfile(data: Record<string, any>): UserProfile {
  return {
    id: data.ownerId || data.username,
    username: data.username,
    displayName: data.displayName || 'Creator',
    bio: data.bio || '',
    location: data.location || '',
    pronouns: data.pronouns || '',
    avatarUrl: data.avatarUrl || '',
    bannerUrl: data.bannerUrl || '',
    isVerified: Boolean(data.isVerified),
    badgeText: data.badgeText || '',
    socials: Array.isArray(data.socials) ? data.socials : [],
    links: Array.isArray(data.links) ? data.links : [],
    theme: data.theme || SAMPLE_PROFILES[0].theme,
    widgets: data.widgets || SAMPLE_PROFILES[0].widgets,
    analytics: makeEmptyAnalytics(),
  };
}

async function findAvailableHandle(preferred: string, uid: string): Promise<string> {
  const base = sanitizeHandle(preferred);
  const candidateRef = doc(db, 'profiles', base);
  try {
    const snap = await getDoc(candidateRef);
    if (!snap.exists() || snap.data()?.ownerId === uid) {
      return base;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `profiles/${base}`);
  }

  const withSuffix = `${base.slice(0, 32)}_${uid.slice(0, 5).toLowerCase()}`;
  return sanitizeHandle(withSuffix);
}

export function createCleanCreatorProfile(user?: User | null, handle = 'creator'): UserProfile {
  return {
    id: user?.uid || 'creator',
    username: handle,
    displayName: clampStr(user?.displayName || 'Creator', 100),
    bio: 'Welcome to my official LinkSphere page. Explore my links and get in touch!',
    location: '',
    pronouns: '',
    avatarUrl: clampStr(
      user?.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      1000
    ),
    bannerUrl: '',
    isVerified: false,
    badgeText: 'Creator',
    socials: [],
    links: [
      {
        id: 'starter_1',
        title: 'My Website / Portfolio',
        subtitle: 'Check out my latest work and projects',
        url: 'https://example.com',
        active: true,
        icon: '🌐',
        highlight: true,
        animation: 'none',
        clicks: 0,
        badge: 'Featured',
      },
      {
        id: 'starter_2',
        title: 'Connect with Me',
        subtitle: 'Follow my updates and social channels',
        url: 'https://github.com',
        active: true,
        icon: '🔗',
        highlight: false,
        animation: 'none',
        clicks: 0,
      },
    ],
    theme: PRESET_THEMES[0],
    widgets: {
      showContactForm: true,
      contactEmail: clampStr(user?.email || '', 256),
      showCoffeeButton: false,
      coffeeUsername: handle,
      coffeeLabel: 'Buy Me a Coffee',
      customFooterText: 'Powered by LinkSphere',
      showShareButton: true,
      showQRCodeButton: true,
      showVCardDownload: true,
    },
    analytics: makeEmptyAnalytics(),
  };
}

export async function loadOrCreateCreatorAccount(
  user: User
): Promise<{ profile: UserProfile; cloudUsername: string; isNewUser: boolean }> {
  const userPath = `users/${user.uid}`;
  let userSnap;
  try {
    userSnap = await getDoc(doc(db, 'users', user.uid));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, userPath);
  }

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const existingHandle = sanitizeHandle(userData.username);
    const profPath = `profiles/${existingHandle}`;
    let profSnap;
    try {
      profSnap = await getDoc(doc(db, 'profiles', existingHandle));
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, profPath);
    }

    if (profSnap.exists()) {
      return {
        profile: docToUserProfile(profSnap.data()),
        cloudUsername: existingHandle,
        isNewUser: false,
      };
    }

    // Account record exists without profile doc (recover cleanly)
    const recoveredProfile = createCleanCreatorProfile(user, existingHandle);
    const payload = {
      ...buildSanitizedProfilePayload(user.uid, existingHandle, recoveredProfile, true),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, 'profiles', existingHandle), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, profPath);
    }
    return {
      profile: recoveredProfile,
      cloudUsername: existingHandle,
      isNewUser: false,
    };
  }

  // First-time Google Login: build a fresh personal profile strictly from the user's Google account
  const emailPrefix = (user.email || '').split('@')[0] || user.displayName || 'creator';
  const uniqueHandle = await findAvailableHandle(emailPrefix, user.uid);
  const starterProfile = createCleanCreatorProfile(user, uniqueHandle);

  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: clampStr(user.email || '', 256),
      displayName: clampStr(user.displayName || 'Creator', 100),
      photoURL: clampStr(user.photoURL || '', 1000),
      username: uniqueHandle,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, userPath);
  }

  const profilePath = `profiles/${uniqueHandle}`;
  try {
    await setDoc(doc(db, 'profiles', uniqueHandle), {
      ...buildSanitizedProfilePayload(user.uid, uniqueHandle, starterProfile, true),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, profilePath);
  }

  return {
    profile: starterProfile,
    cloudUsername: uniqueHandle,
    isNewUser: true,
  };
}

export async function saveProfileToCloud(
  user: User,
  previousCloudUsername: string | null,
  profile: UserProfile,
  published = true
): Promise<{ ok: true; username: string } | { ok: false; reason: 'taken' | 'invalid' }> {
  const desired = (profile.username || '').trim().toLowerCase();
  if (desired.length < MIN_HANDLE_LENGTH || desired.length > MAX_HANDLE_LENGTH || !HANDLE_REGEX.test(desired)) {
    return { ok: false, reason: 'invalid' };
  }

  const targetPath = `profiles/${desired}`;
  let existingSnap;
  try {
    existingSnap = await getDoc(doc(db, 'profiles', desired));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, targetPath);
  }

  if (existingSnap.exists() && existingSnap.data()?.ownerId !== user.uid) {
    return { ok: false, reason: 'taken' };
  }

  const sanitized = buildSanitizedProfilePayload(user.uid, desired, profile, published);

  if (existingSnap.exists()) {
    try {
      await updateDoc(doc(db, 'profiles', desired), {
        displayName: sanitized.displayName,
        bio: sanitized.bio,
        location: sanitized.location,
        pronouns: sanitized.pronouns,
        avatarUrl: sanitized.avatarUrl,
        bannerUrl: sanitized.bannerUrl,
        isVerified: sanitized.isVerified,
        badgeText: sanitized.badgeText,
        socials: sanitized.socials,
        links: sanitized.links,
        theme: sanitized.theme,
        widgets: sanitized.widgets,
        published: sanitized.published,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, targetPath);
    }
  } else {
    try {
      await setDoc(doc(db, 'profiles', desired), {
        ...sanitized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, targetPath);
    }
  }

  // Handle rename: sync /users/{uid}.username and remove old handle doc
  if (previousCloudUsername && previousCloudUsername !== desired) {
    const userPath = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username: desired,
        displayName: clampStr(user.displayName || sanitized.displayName, 100),
        photoURL: clampStr(user.photoURL || '', 1000),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, userPath);
    }

    try {
      const oldSnap = await getDoc(doc(db, 'profiles', previousCloudUsername));
      if (oldSnap.exists() && oldSnap.data()?.ownerId === user.uid) {
        await deleteDoc(doc(db, 'profiles', previousCloudUsername));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `profiles/${previousCloudUsername}`);
    }
  }

  return { ok: true, username: desired };
}

/**
 * Public visitor fetch — NO login required!
 */
export async function fetchPublicProfile(
  rawUsername: string
): Promise<{ profile: UserProfile; ownerId: string } | null> {
  const clean = (rawUsername || '').trim().toLowerCase();
  if (clean.length < MIN_HANDLE_LENGTH || clean.length > MAX_HANDLE_LENGTH || !HANDLE_REGEX.test(clean)) {
    return null;
  }

  const path = `profiles/${clean}`;
  try {
    const snap = await getDoc(doc(db, 'profiles', clean));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      profile: docToUserProfile(data),
      ownerId: data.ownerId,
    };
  } catch (err) {
    // If profile exists as unpublished for non-owner, treat gracefully as unavailable
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('insufficient')) {
      return null;
    }
    handleFirestoreError(err, OperationType.GET, path);
  }
}

function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return 'tablet';
  if (/mobi|android|iphone|ipod/.test(ua) || window.innerWidth < 768) return 'mobile';
  return 'desktop';
}

function detectReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'Direct / Bio Link';
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '').toLowerCase();
    if (!host || (typeof window !== 'undefined' && host === window.location.hostname)) {
      return 'Direct / Bio Link';
    }
    if (host.includes('instagram')) return 'Instagram';
    if (host.includes('facebook') || host.includes('fb.com') || host.includes('l.facebook')) return 'Facebook';
    if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube';
    if (host.includes('tiktok')) return 'TikTok';
    if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp';
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) return 'X (Twitter)';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('google')) return 'Google Search';
    return clampStr(host, 80);
  } catch {
    return 'Direct / Bio Link';
  }
}

function getLocalDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Records a public visitor view or click event in Firestore without requiring visitor sign-in.
 */
export async function recordPublicAnalyticsEvent(
  username: string,
  ownerId: string,
  type: 'view' | 'click',
  linkId = '',
  linkTitle = ''
): Promise<void> {
  const cleanUser = (username || '').trim().toLowerCase();
  if (!cleanUser || !ownerId || !HANDLE_REGEX.test(cleanUser)) return;
  if (type === 'click' && !linkId) return;

  const eventId = `ev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const path = `profiles/${cleanUser}/events/${eventId}`;

  try {
    await setDoc(doc(db, 'profiles', cleanUser, 'events', eventId), {
      ownerId: clampStr(ownerId, 128),
      username: cleanUser,
      type,
      linkId: clampStr(linkId, 100),
      linkTitle: clampStr(linkTitle, 120),
      device: detectDevice(),
      referrer: detectReferrer(),
      dayKey: getLocalDayKey(),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Analytics event failed:', path, err);
  }
}

/**
 * Real-time cross-device analytics listener for authenticated profile owners.
 */
export function subscribeOwnerAnalytics(
  username: string,
  ownerId: string,
  onUpdate: (analytics: AnalyticsData, linkClickCounts: Record<string, number>) => void
): Unsubscribe {
  const cleanUser = (username || '').trim().toLowerCase();
  const eventsPath = `profiles/${cleanUser}/events`;
  const q = query(
    collection(db, 'profiles', cleanUser, 'events'),
    where('ownerId', '==', ownerId),
    limit(1000)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      let views = 0;
      let totalClicks = 0;
      const linkClickCounts: Record<string, number> = {};
      const refCounts: Record<string, number> = {};
      const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };

      // Prepare last 7 days skeleton
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayBuckets: Array<{ key: string; label: string; views: number; clicks: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const dt = new Date();
        dt.setDate(dt.getDate() - i);
        dayBuckets.push({
          key: getLocalDayKey(dt),
          label: dayNames[dt.getDay()],
          views: 0,
          clicks: 0,
        });
      }
      const bucketMap = new Map(dayBuckets.map((b) => [b.key, b]));

      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const bucket = bucketMap.get(d.dayKey);

        if (d.type === 'view') {
          views += 1;
          if (bucket) bucket.views += 1;
          const refLabel = d.referrer || 'Direct / Bio Link';
          refCounts[refLabel] = (refCounts[refLabel] || 0) + 1;

          if (d.device === 'mobile') {
            deviceCounts.mobile += 1;
          } else if (d.device === 'desktop') {
            deviceCounts.desktop += 1;
          } else if (d.device === 'tablet') {
            deviceCounts.tablet += 1;
          }
        } else if (d.type === 'click') {
          totalClicks += 1;
          if (bucket) bucket.clicks += 1;
          if (d.linkId) {
            linkClickCounts[d.linkId] = (linkClickCounts[d.linkId] || 0) + 1;
          }
        }
      });

      const totalRefViews = Object.values(refCounts).reduce((a, b) => a + b, 0);
      const referrerStats = Object.entries(refCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([source, count]) => ({
          source,
          count,
          percentage: totalRefViews > 0 ? Math.round((count / totalRefViews) * 100) : 0,
        }));

      const totalDevices = deviceCounts.mobile + deviceCounts.desktop + deviceCounts.tablet;
      const deviceStats =
        totalDevices > 0
          ? {
              mobile: Math.round((deviceCounts.mobile / totalDevices) * 100),
              desktop: Math.round((deviceCounts.desktop / totalDevices) * 100),
              tablet: Math.round((deviceCounts.tablet / totalDevices) * 100),
            }
          : { mobile: 0, desktop: 0, tablet: 0 };

      onUpdate(
        {
          views,
          totalClicks,
          dailyStats: dayBuckets.map((b) => ({
            date: b.label,
            views: b.views,
            clicks: b.clicks,
          })),
          referrerStats,
          deviceStats,
        },
        linkClickCounts
      );
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, eventsPath);
    }
  );
}

export async function clearOwnerAnalytics(username: string, ownerId: string): Promise<void> {
  const cleanUser = (username || '').trim().toLowerCase();
  const eventsPath = `profiles/${cleanUser}/events`;
  try {
    const q = query(
      collection(db, 'profiles', cleanUser, 'events'),
      where('ownerId', '==', ownerId),
      limit(450)
    );
    const snap = await getDocs(q);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, eventsPath);
  }
}

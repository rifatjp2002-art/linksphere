import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile, BioLink, ThemeConfig, WidgetSettings } from './types';
import { SAMPLE_PROFILES } from './data/presets';
import { Navbar } from './components/Navbar';
import { LinksTab } from './components/tabs/LinksTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { AppearanceTab } from './components/tabs/AppearanceTab';
import { WidgetsTab } from './components/tabs/WidgetsTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { LivePreviewPhone } from './components/LivePreviewPhone';
import { PublicBioPage } from './components/PublicBioPage';
import { QRCodeModal } from './components/QRCodeModal';
import { ShareModal } from './components/ShareModal';
import { PublishModal } from './components/PublishModal';
import {
  Smartphone,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  buildLiveShareUrl,
  decodeProfileFromHash,
  getBaseAppUrl,
  getPublishedProfile,
  savePublishedProfile,
} from './utils/publish';
import {
  clearOwnerAnalytics,
  fetchPublicProfile,
  loadOrCreateCreatorAccount,
  recordPublicAnalyticsEvent,
  saveProfileToCloud,
  signInWithGoogle,
  signOutCreator,
  subscribeOwnerAnalytics,
} from './services/cloudBioService';

const STORAGE_KEY = 'linksphere_profile_v1';
const PUBLISHED_AT_KEY = 'linksphere_published_at_v1';

function getInitialDraftProfile(): UserProfile {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
  }
  return SAMPLE_PROFILES[0];
}

function getQueryUsername(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const u = params.get('u');
  return u ? u.trim().toLowerCase() : null;
}

export default function App() {
  const initialHashProfile =
    typeof window !== 'undefined' && window.location.hash.includes('p=')
      ? decodeProfileFromHash(window.location.hash)
      : null;

  const initialQueryUser = getQueryUsername();

  const [profile, setProfile] = useState<UserProfile>(getInitialDraftProfile);
  const [standaloneProfile, setStandaloneProfile] = useState<UserProfile | null>(
    initialHashProfile
  );
  const [standaloneOwnerId, setStandaloneOwnerId] = useState<string | null>(null);
  const [publicLoading, setPublicLoading] = useState<boolean>(
    Boolean(initialQueryUser && !initialHashProfile)
  );
  const [publicNotFound, setPublicNotFound] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [cloudUsername, setCloudUsername] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudLinkClicks, setCloudLinkClicks] = useState<Record<string, number>>({});

  const [activeTab, setActiveTab] = useState<
    'links' | 'profile' | 'themes' | 'widgets' | 'analytics'
  >('links');
  const [isPublicView, setIsPublicView] = useState<boolean>(
    Boolean(initialHashProfile || initialQueryUser)
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'editor' | 'preview'>('editor');

  const [publishedAt, setPublishedAt] = useState<string | null>(() =>
    localStorage.getItem(PUBLISHED_AT_KEY)
  );
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const recordedPublicViewRef = useRef<string | null>(null);
  const draftProfileRef = useRef<UserProfile>(profile);
  draftProfileRef.current = profile;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Resolve public visitor URL (?u=username) WITHOUT requiring login
  useEffect(() => {
    if (!initialQueryUser || initialHashProfile) return;

    let cancelled = false;
    (async () => {
      setPublicLoading(true);
      setPublicNotFound(false);

      // Try Firestore Cloud first (works across all devices & browsers!)
      try {
        const cloudResult = await fetchPublicProfile(initialQueryUser);
        if (cancelled) return;
        if (cloudResult) {
          setStandaloneProfile(cloudResult.profile);
          setStandaloneOwnerId(cloudResult.ownerId);
          setIsPublicView(true);
          setPublicLoading(false);

          if (recordedPublicViewRef.current !== cloudResult.profile.username) {
            recordedPublicViewRef.current = cloudResult.profile.username;
            recordPublicAnalyticsEvent(
              cloudResult.profile.username,
              cloudResult.ownerId,
              'view'
            );
          }
          return;
        }
      } catch (err) {
        console.warn('Cloud public profile lookup fallback:', err);
      }

      // Fallback: localStorage or demo preset
      const localPublished = getPublishedProfile(initialQueryUser);
      const fromPreset = SAMPLE_PROFILES.find(
        (p) => p.username.toLowerCase() === initialQueryUser
      );
      const fallback = localPublished || fromPreset || null;

      if (!cancelled) {
        if (fallback) {
          setStandaloneProfile(fallback);
          setIsPublicView(true);
        } else {
          setPublicNotFound(true);
          setIsPublicView(true);
        }
        setPublicLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialQueryUser, initialHashProfile]);

  // 2. Listen to Firebase Authentication state for Creator Editor
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setCloudUsername(null);
        setAuthLoading(false);
        return;
      }

      try {
        setIsSyncingCloud(true);
        const { profile: cloudProfile, cloudUsername: handle, isNewUser } =
          await loadOrCreateCreatorAccount(firebaseUser, draftProfileRef.current);
        setProfile(cloudProfile);
        setCloudUsername(handle);
        setHasUnpublishedChanges(false);
        const now = new Date().toISOString();
        localStorage.setItem(PUBLISHED_AT_KEY, now);
        setPublishedAt(now);
        if (isNewUser) {
          showToast(`স্বাগতম! আপনার একাউন্ট @${handle} তৈরি ও লাইভ হয়েছে।`, 'success');
        }
      } catch (err) {
        console.error('Failed to sync creator account', err);
        showToast('Cloud account load করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
      } finally {
        setIsSyncingCloud(false);
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // 3. Real-time Firestore Analytics Subscription (only when authenticated owner)
  useEffect(() => {
    if (!user || !cloudUsername) return;

    const unsub = subscribeOwnerAnalytics(cloudUsername, user.uid, (analyticsData, clickMap) => {
      setCloudLinkClicks(clickMap);
      setProfile((prev) => ({
        ...prev,
        analytics: analyticsData,
      }));
    });

    return () => unsub();
  }, [user, cloudUsername]);

  // Keep local draft synced for offline convenience
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, user]);

  // Listen for hash changes if user pastes or navigates to a published hash URL
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('p=')) {
        const decoded = decodeProfileFromHash(window.location.hash);
        if (decoded) {
          setStandaloneProfile(decoded);
          setStandaloneOwnerId(null);
          setPublicNotFound(false);
          setIsPublicView(true);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSignInGoogle = async () => {
    try {
      await signInWithGoogle();
      showToast('Google দিয়ে সফলভাবে সাইন ইন হয়েছে!', 'success');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') return;
      showToast('Google Login সফল হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
    }
  };

  const handleSignOut = async () => {
    await signOutCreator();
    setCloudUsername(null);
    setCloudLinkClicks({});
    showToast('সফলভাবে Sign Out হয়েছেন।', 'success');
  };

  const markEdited = () => {
    setHasUnpublishedChanges(true);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    markEdited();
  };

  const handleUpdateLinks = (links: BioLink[]) => {
    setProfile((prev) => ({ ...prev, links }));
    markEdited();
  };

  const handleUpdateTheme = (theme: ThemeConfig) => {
    setProfile((prev) => ({ ...prev, theme }));
    markEdited();
  };

  const handleUpdateWidgets = (widgets: WidgetSettings) => {
    setProfile((prev) => ({ ...prev, widgets }));
    markEdited();
  };

  const handlePublishNow = async () => {
    savePublishedProfile(profile);

    if (user) {
      setIsSyncingCloud(true);
      try {
        const result = await saveProfileToCloud(user, cloudUsername, profile, true);
        if (result.ok) {
          setCloudUsername(result.username);
          const now = new Date().toISOString();
          localStorage.setItem(PUBLISHED_AT_KEY, now);
          setPublishedAt(now);
          setHasUnpublishedChanges(false);
          showToast(
            `Published Live! আপনার পেজ ?u=${result.username} এখন সবার জন্য উন্মুক্ত।`,
            'success'
          );
        } else if (result.reason === 'taken') {
          showToast(
            `ইউজারনেম @${profile.username} ইতিমধ্যে অন্য কেউ নিয়ে নিয়েছে! দয়া করে Profile ট্যাব থেকে অন্য ইউজারনেম দিন।`,
            'error'
          );
        } else {
          showToast(
            'ইউজারনেম কমপক্ষে ২ অক্ষরের (শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা, _ বা -) হতে হবে।',
            'error'
          );
        }
      } catch (err) {
        console.error('Cloud publish failed', err);
        showToast('Cloud-এ পাবলিশ করতে সমস্যা হয়েছে।', 'error');
      } finally {
        setIsSyncingCloud(false);
      }
      return;
    }

    const now = new Date().toISOString();
    localStorage.setItem(PUBLISHED_AT_KEY, now);
    setPublishedAt(now);
    setHasUnpublishedChanges(false);
    showToast('Published! শেয়ার করার জন্য আপনার বায়ো লিংক প্রস্তুত।', 'success');
  };

  const getTodayShortName = () =>
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  const recordLocalView = () => {
    if (user && cloudUsername) return;
    const today = getTodayShortName();
    setProfile((prev) => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        views: prev.analytics.views + 1,
        dailyStats: prev.analytics.dailyStats.map((d) =>
          d.date === today ? { ...d, views: d.views + 1 } : d
        ),
      },
    }));
  };

  const handleLinkClick = (linkOrId: string | BioLink) => {
    const linkId = typeof linkOrId === 'string' ? linkOrId : linkOrId.id;
    const linkTitle = typeof linkOrId === 'string' ? '' : linkOrId.title;

    // Public standalone visitor clicking link
    if (standaloneProfile) {
      if (standaloneOwnerId) {
        recordPublicAnalyticsEvent(
          standaloneProfile.username,
          standaloneOwnerId,
          'click',
          linkId,
          linkTitle
        );
      }
      setStandaloneProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          links: prev.links.map((l) => (l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l)),
          analytics: {
            ...prev.analytics,
            totalClicks: prev.analytics.totalClicks + 1,
          },
        };
      });
      return;
    }

    // Creator previewing in cloud mode: also record or skip so analytics stay real
    if (user && cloudUsername) {
      const targetLink = profile.links.find((l) => l.id === linkId);
      recordPublicAnalyticsEvent(
        cloudUsername,
        user.uid,
        'click',
        linkId,
        targetLink?.title || linkTitle
      );
      return;
    }

    const today = getTodayShortName();
    setProfile((prev) => {
      const updatedLinks = prev.links.map((l) =>
        l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l
      );
      return {
        ...prev,
        links: updatedLinks,
        analytics: {
          ...prev.analytics,
          totalClicks: updatedLinks.reduce((sum, l) => sum + l.clicks, 0),
          dailyStats: prev.analytics.dailyStats.map((d) =>
            d.date === today ? { ...d, clicks: d.clicks + 1 } : d
          ),
        },
      };
    });
  };

  const handleSimulateClick = () => {
    const today = getTodayShortName();
    const addedViews = Math.floor(Math.random() * 5) + 1;
    setProfile((prev) => {
      if (prev.links.length === 0) {
        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            views: prev.analytics.views + addedViews,
            dailyStats: prev.analytics.dailyStats.map((d) =>
              d.date === today ? { ...d, views: d.views + addedViews } : d
            ),
          },
        };
      }
      const randomLinkIndex = Math.floor(Math.random() * prev.links.length);
      const updatedLinks = prev.links.map((l, i) =>
        i === randomLinkIndex ? { ...l, clicks: l.clicks + 1 } : l
      );
      return {
        ...prev,
        links: updatedLinks,
        analytics: {
          ...prev.analytics,
          views: prev.analytics.views + addedViews,
          totalClicks: updatedLinks.reduce((sum, l) => sum + l.clicks, 0),
          dailyStats: prev.analytics.dailyStats.map((d) =>
            d.date === today ? { ...d, views: d.views + addedViews, clicks: d.clicks + 1 } : d
          ),
        },
      };
    });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  const handleResetAnalytics = async () => {
    if (user && cloudUsername) {
      await clearOwnerAnalytics(cloudUsername, user.uid);
      showToast('সব Cloud Analytics ডেটা 0 থেকে রিসেট করা হয়েছে।');
      return;
    }

    setProfile((prev) => ({
      ...prev,
      links: prev.links.map((l) => ({ ...l, clicks: 0 })),
      analytics: {
        ...prev.analytics,
        views: 0,
        totalClicks: 0,
        dailyStats: prev.analytics.dailyStats.map((d) => ({ ...d, views: 0, clicks: 0 })),
      },
    }));
    showToast('সব Analytics ডেটা 0 থেকে রিসেট করা হয়েছে।');
  };

  const handleSelectPreset = (preset: UserProfile) => {
    setProfile((prev) => ({
      ...preset,
      // Keep cloud user's username if signed in so they don't accidentally overwrite another handle
      username: user && cloudUsername ? prev.username : preset.username,
      analytics: user ? prev.analytics : preset.analytics,
    }));
    markEdited();
    showToast(`Loaded "${preset.displayName}" template.`);
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.username}_linksphere_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Profile JSON exported.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.username && Array.isArray(imported.links)) {
          setProfile(imported);
          markEdited();
          showToast('Profile successfully imported!');
        } else {
          showToast('Invalid LinkSphere profile file.', 'error');
        }
      } catch {
        showToast('Invalid JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Merge real cloud per-link clicks into profile when authenticated
  const mergedProfile: UserProfile =
    user && cloudUsername
      ? {
          ...profile,
          links: profile.links.map((l) => ({
            ...l,
            clicks: cloudLinkClicks[l.id] || 0,
          })),
        }
      : profile;

  const activePublicProfile = standaloneProfile || mergedProfile;
  const shareUrl = buildLiveShareUrl(activePublicProfile, !(user && cloudUsername));

  const handleExitPublicView = () => {
    if (standaloneProfile || publicNotFound) {
      window.history.replaceState({}, '', getBaseAppUrl());
      setStandaloneProfile(null);
      setStandaloneOwnerId(null);
      setPublicNotFound(false);
    }
    setIsPublicView(false);
  };

  // Loading Screen for Public Visitor resolving ?u=username
  if (publicLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm font-medium text-slate-300">Loading bio page...</p>
      </div>
    );
  }

  // Profile Not Found state for ?u=unknown
  if (isPublicView && publicNotFound) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white">
        <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold">Profile Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            এই ইউজারনেমের (<span className="font-mono text-white">@{initialQueryUser}</span>) কোনো পাবলিক বায়ো পেজ পাওয়া যায়নি বা এখনো পাবলিশ করা হয়নি।
          </p>
          <button
            type="button"
            onClick={handleExitPublicView}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
          >
            Create Your Own LinkSphere
          </button>
        </div>
      </div>
    );
  }

  // Standalone Fullscreen Public View Mode (No login needed for visitors!)
  if (isPublicView) {
    return (
      <>
        <PublicBioPage
          profile={activePublicProfile}
          isStandalonePublishedView={Boolean(standaloneProfile)}
          onBackToEditor={handleExitPublicView}
          onOpenQR={() => setQrModalOpen(true)}
          onOpenShare={() => setShareModalOpen(true)}
          onLinkClick={handleLinkClick}
        />
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          url={shareUrl}
          username={activePublicProfile.username}
          displayName={activePublicProfile.displayName}
        />
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          profile={activePublicProfile}
          isCloudUser={Boolean(standaloneOwnerId || (user && cloudUsername))}
          onOpenQR={() => {
            setShareModalOpen(false);
            setQrModalOpen(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentProfile={mergedProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        onOpenQR={() => setQrModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
        onOpenPublish={() => setPublishModalOpen(true)}
        hasUnpublishedChanges={hasUnpublishedChanges}
        onTogglePublicView={() => {
          recordLocalView();
          setIsPublicView(true);
        }}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        user={user}
        authLoading={authLoading}
        isSyncingCloud={isSyncingCloud}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
        showMobileTabs={mobileLayoutMode === 'editor'}
      />

      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-sm z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold bg-slate-900 text-white border-slate-700">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="break-words min-w-0">{toast.message}</span>
        </div>
      )}

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-5 pb-24 sm:p-6 lg:pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
        {/* Left Side: Editor Panels */}
        <section
          className={`lg:col-span-7 space-y-6 min-w-0 w-full ${
            mobileLayoutMode === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {activeTab === 'links' && (
            <LinksTab profile={mergedProfile} onUpdateLinks={handleUpdateLinks} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab profile={mergedProfile} onUpdateProfile={handleUpdateProfile} />
          )}

          {activeTab === 'themes' && (
            <AppearanceTab profile={mergedProfile} onUpdateTheme={handleUpdateTheme} />
          )}

          {activeTab === 'widgets' && (
            <WidgetsTab profile={mergedProfile} onUpdateWidgets={handleUpdateWidgets} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              profile={mergedProfile}
              isCloudConnected={Boolean(user && cloudUsername)}
              onSignInGoogle={handleSignInGoogle}
              onSimulateClick={handleSimulateClick}
              onResetAnalytics={handleResetAnalytics}
            />
          )}
        </section>

        {/* Right Side: Interactive Device Preview Frame */}
        <section
          className={`lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center justify-center min-w-0 w-full ${
            mobileLayoutMode === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <LivePreviewPhone
            profile={mergedProfile}
            onLinkClick={handleLinkClick}
            onOpenQR={() => setQrModalOpen(true)}
            onOpenShare={() => setShareModalOpen(true)}
            onOpenPublicView={() => {
              recordLocalView();
              setIsPublicView(true);
            }}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
          />
        </section>
      </main>

      {/* Clean Floating Mobile Switcher (Editor vs Preview) */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMobileLayoutMode('editor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition ${
              mobileLayoutMode === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileLayoutMode('preview')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition ${
              mobileLayoutMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        profile={mergedProfile}
        publishedAt={publishedAt}
        hasUnpublishedChanges={hasUnpublishedChanges}
        isCloudConnected={Boolean(user && cloudUsername)}
        isPublishing={isSyncingCloud}
        onSignInGoogle={handleSignInGoogle}
        onPublishNow={handlePublishNow}
        onOpenQR={() => setQrModalOpen(true)}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        url={shareUrl}
        username={mergedProfile.username}
        displayName={mergedProfile.displayName}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        profile={mergedProfile}
        isCloudUser={Boolean(user && cloudUsername)}
        onOpenQR={() => {
          setShareModalOpen(false);
          setQrModalOpen(true);
        }}
      />
    </div>
  );
}

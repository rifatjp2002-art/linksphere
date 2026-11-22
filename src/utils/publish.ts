import { UserProfile } from '../types';

const PUBLISHED_PREFIX = 'linksphere_published_';

/**
 * Ensures any user-provided URL has a valid protocol so links always open cleanly.
 */
export function normalizeUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '#';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  if (trimmed.includes('@') && !trimmed.includes('/') && !trimmed.includes('.com')) {
    return `mailto:${trimmed}`;
  }
  return `https://${trimmed}`;
}

export function isValidLinkUrl(rawUrl: string): boolean {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed || trimmed === 'https://' || trimmed === 'http://') return false;
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed.length > 7;
  }
  try {
    const url = new URL(normalizeUrl(trimmed));
    return Boolean(url.hostname && url.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function isLightTheme(profile: UserProfile): boolean {
  const { theme } = profile;
  return (
    theme.id === 'minimal-snow' ||
    theme.id === 'pastel-sakura' ||
    theme.pageBgColor === '#f8fafc' ||
    theme.pageBgColor === '#fff1f2'
  );
}

/**
 * UTF-8 safe Base64URL encoding for portable, serverless published links (works on GitHub Pages!)
 */
export function encodeProfileToHash(profile: UserProfile): string {
  try {
    // Keep only essential public fields to keep URL compact
    const compactPayload = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      location: profile.location,
      pronouns: profile.pronouns,
      avatarUrl: profile.avatarUrl,
      bannerUrl: profile.bannerUrl,
      isVerified: profile.isVerified,
      badgeText: profile.badgeText,
      socials: profile.socials,
      links: profile.links,
      theme: profile.theme,
      widgets: profile.widgets,
    };
    const json = JSON.stringify(compactPayload);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode profile', err);
    return '';
  }
}

export function decodeProfileFromHash(hashValue: string): UserProfile | null {
  try {
    if (!hashValue) return null;
    const clean = hashValue.replace(/^#?p=/, '');
    const padded = clean.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padLen);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (!parsed || !parsed.username) return null;
    return {
      ...parsed,
      analytics: parsed.analytics || {
        views: 1,
        totalClicks: 0,
        dailyStats: [],
        referrerStats: [],
        deviceStats: { mobile: 80, desktop: 18, tablet: 2 },
      },
    } as UserProfile;
  } catch (err) {
    console.error('Failed to decode profile from URL hash', err);
    return null;
  }
}

export function savePublishedProfile(profile: UserProfile): void {
  const key = `${PUBLISHED_PREFIX}${profile.username.toLowerCase()}`;
  localStorage.setItem(key, JSON.stringify({ ...profile, publishedAt: new Date().toISOString() }));
}

export function getPublishedProfile(username: string): UserProfile | null {
  const key = `${PUBLISHED_PREFIX}${username.toLowerCase()}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function getBaseAppUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
}

export function buildLiveShareUrl(profile: UserProfile, includeHashPayload = true): string {
  const base = getBaseAppUrl();
  const usernameParam = encodeURIComponent(profile.username || 'creator');
  if (!includeHashPayload) {
    return `${base}?u=${usernameParam}`;
  }
  const encoded = encodeProfileToHash(profile);
  return encoded ? `${base}?u=${usernameParam}#p=${encoded}` : `${base}?u=${usernameParam}`;
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generates a complete, standalone single-file HTML website for GitHub Pages hosting.
 */
export function generateStandaloneHtml(profile: UserProfile): string {
  const light = isLightTheme(profile);
  const bg = profile.theme.pageBgColor || (light ? '#f8fafc' : '#090d16');
  const textPrimary = light ? '#0f172a' : '#ffffff';
  const textSecondary = light ? '#475569' : '#cbd5e1';
  const cardBg = light ? 'rgba(255,255,255,0.92)' : 'rgba(30,41,59,0.75)';
  const cardBorder = light ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.14)';
  const cardText = light ? '#0f172a' : '#f8fafc';
  const cardSub = light ? '#64748b' : '#94a3b8';
  const accent = profile.theme.accentColor || '#6366f1';

  const radiusMap: Record<string, string> = {
    none: '0px',
    sm: '6px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  };
  const cardRadius = radiusMap[profile.theme.cardRadius] || '16px';
  const fontCss =
    profile.theme.fontFamily === 'mono'
      ? `'JetBrains Mono', ui-monospace, SFMono-Regular, monospace`
      : profile.theme.fontFamily === 'serif'
      ? `'Lora', 'Hind Siliguri', Georgia, 'Times New Roman', serif`
      : `'Plus Jakarta Sans', 'Hind Siliguri', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  const activeSocials = profile.socials
    .filter((s) => s.active && s.url)
    .map(
      (s) =>
        `<a class="social-pill" href="${escapeHtml(normalizeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(
          s.label || s.platform
        )}</a>`
    )
    .join('\n        ');

  const activeLinks = profile.links
    .filter((l) => l.active)
    .map((l) => {
      const animClass = l.animation && l.animation !== 'none' ? `anim-${l.animation}` : '';
      return `<a class="bio-link ${animClass}" href="${escapeHtml(normalizeUrl(l.url))}" target="_blank" rel="noopener noreferrer">
        <div class="link-left">
          ${l.icon ? `<span class="link-icon">${escapeHtml(l.icon)}</span>` : ''}
          <div class="link-text">
            <div class="link-title">
              <span class="link-title-text">${escapeHtml(l.title)}</span>
              ${l.badge ? `<span class="link-badge">${escapeHtml(l.badge)}</span>` : ''}
            </div>
            ${l.subtitle ? `<div class="link-sub">${escapeHtml(l.subtitle)}</div>` : ''}
          </div>
        </div>
        <span class="link-arrow">↗</span>
      </a>`;
    })
    .join('\n      ');

  const coffeeBlock = profile.widgets.showCoffeeButton
    ? `<a class="coffee-btn" href="https://buymeacoffee.com/${escapeHtml(
        profile.widgets.coffeeUsername || profile.username
      )}" target="_blank" rel="noopener noreferrer">☕ ${escapeHtml(
        profile.widgets.coffeeLabel || 'Buy Me a Coffee'
      )}</a>`
    : '';

  const receiverEmail = (profile.widgets.contactEmail || '').trim();
  const contactBlock =
    profile.widgets.showContactForm && receiverEmail
      ? `<section class="contact-box">
      <div class="contact-title">✉️ Send Direct Message</div>
      <form action="https://formsubmit.co/${escapeHtml(receiverEmail)}" method="POST" class="contact-form">
        <input type="hidden" name="_subject" value="New Message from LinkSphere (@${escapeHtml(profile.username)})" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="text" name="name" placeholder="Your Name / আপনার নাম" required />
        <input type="email" name="email" placeholder="Your Email / আপনার ইমেইল" required />
        <textarea name="message" rows="3" placeholder="Message / আপনার বার্তা লিখুন..." required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(profile.displayName)} (@${escapeHtml(profile.username)})</title>
  <meta name="description" content="${escapeHtml(profile.bio)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=JetBrains+Mono:wght@400;700&family=Lora:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { max-width: 100%; overflow-x: hidden; }
    body {
      min-height: 100vh;
      background: ${bg};
      color: ${textPrimary};
      font-family: ${fontCss};
      display: flex;
      justify-content: center;
      padding: 36px 16px 64px;
    }
    .container {
      width: 100%;
      max-width: 520px;
      text-align: center;
      overflow-wrap: anywhere;
    }
    .banner {
      width: 100%;
      height: 140px;
      border-radius: 18px;
      overflow: hidden;
      margin-bottom: -52px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.25);
    }
    .banner img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-wrap {
      width: 108px;
      height: 108px;
      margin: 0 auto 14px;
      border-radius: 9999px;
      padding: 4px;
      background: rgba(255,255,255,0.22);
      border: 2px solid ${cardBorder};
      box-shadow: 0 12px 28px rgba(0,0,0,0.25);
      position: relative;
    }
    .avatar-wrap img { width: 100%; height: 100%; border-radius: 9999px; object-fit: cover; }
    h1 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; word-break: break-word; }
    .verified { color: #3b82f6; margin-left: 6px; font-size: 1.1rem; }
    .handle { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.85rem; color: ${textSecondary}; margin-top: 4px; }
    .meta { font-size: 0.78rem; color: ${textSecondary}; margin-top: 6px; opacity: 0.85; }
    .bio { font-size: 0.92rem; line-height: 1.55; color: ${textSecondary}; margin: 14px auto 0; max-width: 440px; white-space: pre-line; word-break: break-word; }
    .socials { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 18px; }
    .social-pill {
      padding: 7px 13px;
      border-radius: 9999px;
      background: ${cardBg};
      border: 1px solid ${cardBorder};
      color: ${cardText};
      font-size: 0.78rem;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.18s ease;
    }
    .social-pill:hover { transform: translateY(-2px); }
    .links { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    .bio-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 18px;
      border-radius: ${cardRadius};
      background: ${cardBg};
      border: 1px solid ${cardBorder};
      color: ${cardText};
      text-decoration: none;
      text-align: left;
      backdrop-filter: blur(10px);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      max-width: 100%;
      overflow: hidden;
    }
    .bio-link:hover { transform: scale(1.018); box-shadow: 0 10px 25px rgba(0,0,0,0.18); }
    .link-left { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
    .link-text { min-width: 0; flex: 1; }
    .link-icon { font-size: 1.3rem; flex-shrink: 0; }
    .link-title { font-size: 0.92rem; font-weight: 700; display: flex; align-items: center; gap: 8px; min-width: 0; }
    .link-title-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link-badge {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 6px;
      background: ${accent}33;
      color: ${accent};
      border: 1px solid ${accent}55;
      flex-shrink: 0;
    }
    .link-sub { font-size: 0.78rem; color: ${cardSub}; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .link-arrow { opacity: 0.65; font-size: 1rem; margin-left: 10px; flex-shrink: 0; }
    .coffee-btn {
      display: block;
      margin-top: 18px;
      padding: 14px 18px;
      border-radius: 16px;
      background: #f59e0b;
      color: #090d16;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      transition: transform 0.18s ease;
    }
    .coffee-btn:hover { transform: scale(1.02); }
    .footer { margin-top: 38px; padding-top: 18px; border-top: 1px solid ${cardBorder}; font-size: 0.75rem; color: ${textSecondary}; opacity: 0.75; }
    .contact-box { margin-top: 22px; padding: 16px; border-radius: 18px; background: ${cardBg}; border: 1px solid ${cardBorder}; text-align: left; }
    .contact-title { font-size: 0.88rem; font-weight: 700; margin-bottom: 10px; color: ${cardText}; }
    .contact-form { display: flex; flex-direction: column; gap: 8px; }
    .contact-form input, .contact-form textarea { width: 100%; padding: 9px 12px; border-radius: 10px; border: 1px solid ${cardBorder}; background: ${light ? '#f8fafc' : 'rgba(0,0,0,0.3)'}; color: ${cardText}; font-size: 0.85rem; font-family: inherit; outline: none; }
    .contact-form button { padding: 10px 14px; border-radius: 10px; border: none; background: #4f46e5; color: #fff; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
    .contact-form button:hover { background: #4338ca; }
    .anim-pulse { animation: pulse 2s infinite; }
    .anim-glow { box-shadow: 0 0 18px ${accent}66; border-color: ${accent}; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.78; } }
  </style>
</head>
<body>
  <main class="container">
    ${profile.bannerUrl ? `<div class="banner"><img src="${escapeHtml(profile.bannerUrl)}" alt="Banner" /></div>` : ''}
    <div class="avatar-wrap">
      <img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.displayName)}" />
    </div>
    <h1>${escapeHtml(profile.displayName)}${profile.isVerified ? '<span class="verified" title="Verified">✔</span>' : ''}</h1>
    <p class="handle">@${escapeHtml(profile.username)}</p>
    ${profile.location || profile.pronouns ? `<p class="meta">${escapeHtml([profile.location, profile.pronouns].filter(Boolean).join(' • '))}</p>` : ''}
    ${profile.bio ? `<p class="bio">${escapeHtml(profile.bio)}</p>` : ''}
    ${activeSocials ? `<div class="socials">\n        ${activeSocials}\n      </div>` : ''}
    <section class="links">
      ${activeLinks}
    </section>
    ${coffeeBlock}
    ${contactBlock}
    <footer class="footer">${escapeHtml(profile.widgets.customFooterText || 'Powered by LinkSphere')}</footer>
  </main>
</body>
</html>`;
}

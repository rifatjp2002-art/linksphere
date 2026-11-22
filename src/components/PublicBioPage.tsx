import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Share2,
  QrCode,
  ExternalLink,
  Coffee,
  ArrowLeft,
  Edit3,
  LogIn,
} from 'lucide-react';
import { UserProfile, BioLink } from '../types';
import { SocialIcon } from './SocialIcons';
import { ContactFormWidget } from './ContactFormWidget';
import { normalizeUrl, isLightTheme } from '../utils/publish';
import confetti from 'canvas-confetti';

interface PublicBioPageProps {
  profile: UserProfile;
  isStandalonePublishedView?: boolean;
  isSignedIn?: boolean;
  isOwnProfile?: boolean;
  onBackToEditor: () => void;
  onOpenQR: () => void;
  onOpenShare: () => void;
  onLinkClick?: (link: BioLink) => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({
  profile,
  isStandalonePublishedView = false,
  isSignedIn = false,
  isOwnProfile = false,
  onBackToEditor,
  onOpenQR,
  onOpenShare,
  onLinkClick,
}) => {
  const [clickedLinkId, setClickedLinkId] = useState<string | null>(null);
  const { theme, widgets } = profile;
  const light = isLightTheme(profile);

  const handleLinkClick = (link: BioLink) => {
    setClickedLinkId(link.id);
    if (onLinkClick) {
      onLinkClick(link);
    }
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.5 } });
    setTimeout(() => {
      setClickedLinkId(null);
    }, 350);
  };

  const getCardRadiusClass = () => {
    switch (theme.cardRadius) {
      case 'none':
        return 'rounded-none';
      case 'sm':
        return 'rounded-md';
      case 'md':
        return 'rounded-xl';
      case 'lg':
        return 'rounded-2xl';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-2xl';
    }
  };

  const getAnimationClass = (anim?: string) => {
    switch (anim) {
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'glow':
        return 'ring-2 ring-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]';
      default:
        return '';
    }
  };

  const fontStyle =
    theme.fontFamily === 'mono'
      ? 'var(--font-mono)'
      : theme.fontFamily === 'serif'
      ? 'var(--font-serif)'
      : 'var(--font-sans)';

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden bg-gradient-to-b ${theme.bgGradient} relative flex flex-col items-center justify-between selection:bg-indigo-500 selection:text-white pb-16`}
      style={{ fontFamily: fontStyle }}
    >
      {/* Floating Top Nav for Editor Switcher & Share */}
      <div className="sticky top-3 z-40 w-full max-w-xl px-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToEditor}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-black/55 hover:bg-black/75 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg border border-white/15 transition truncate"
        >
          {isStandalonePublishedView ? (
            isSignedIn ? (
              <>
                <Edit3 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{isOwnProfile ? 'Edit My Page' : 'My Studio'}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Sign in / Create Yours</span>
              </>
            )
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">Back to Editor</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {widgets.showQRCodeButton && (
            <button
              type="button"
              onClick={onOpenQR}
              className="p-2 sm:p-2.5 bg-black/55 hover:bg-black/75 backdrop-blur-md rounded-full text-white transition border border-white/15 shadow-lg"
              title="QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}
          {widgets.showShareButton && (
            <button
              type="button"
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-black/55 hover:bg-black/75 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg border border-white/15 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Center Container */}
      <div className="w-full max-w-lg px-4 pt-6 text-center min-w-0">
        {/* Banner */}
        {profile.bannerUrl && (
          <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden mb-[-48px] shadow-xl relative">
            <img
              src={profile.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Avatar */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-white/25 backdrop-blur-md shadow-2xl overflow-hidden mx-auto border-2 border-white/50">
            <img
              src={
                profile.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
              }
              alt={profile.displayName}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          {profile.isVerified && (
            <div
              className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg"
              title="Verified"
            >
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-500 text-white" />
            </div>
          )}
        </div>

        {/* Display Name */}
        <div className="flex items-center justify-center gap-2 flex-wrap px-2">
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight break-words max-w-full ${theme.nameColor}`}>
            {profile.displayName || 'Your Name'}
          </h1>
          {profile.isVerified && (
            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 inline" />
          )}
        </div>

        <p
          className={`text-sm font-mono opacity-80 mt-1 truncate max-w-full ${
            light ? 'text-slate-600' : 'text-white/90'
          }`}
        >
          @{profile.username || 'username'}
        </p>

        {/* Location & Pronouns */}
        {(profile.location || profile.pronouns) && (
          <div
            className={`flex items-center justify-center gap-2 text-xs mt-2 flex-wrap ${
              light ? 'text-slate-600' : 'text-white/70'
            }`}
          >
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="break-words">{profile.location}</span>
              </span>
            )}
            {profile.location && profile.pronouns && <span>•</span>}
            {profile.pronouns && <span>{profile.pronouns}</span>}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p
            className={`text-sm mt-3.5 max-w-md mx-auto leading-relaxed whitespace-pre-line break-words ${theme.bioColor}`}
          >
            {profile.bio}
          </p>
        )}

        {/* Social Strip */}
        {profile.socials.some((s) => s.active && s.url) && (
          <div className="flex items-center justify-center gap-2.5 flex-wrap mt-5">
            {profile.socials
              .filter((s) => s.active && s.url)
              .map((social) => (
                <a
                  key={social.id}
                  href={normalizeUrl(social.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full backdrop-blur-md border transition-all hover:scale-110 shadow-md ${
                    light
                      ? 'bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 border-slate-900/10'
                      : 'bg-white/10 hover:bg-white/25 text-white border-white/15'
                  }`}
                  title={social.label || social.platform}
                >
                  <SocialIcon platform={social.platform} className="w-5 h-5" />
                </a>
              ))}
          </div>
        )}

        {/* Links List */}
        <div className="mt-7 space-y-3.5">
          {profile.links
            .filter((l) => l.active)
            .map((link) => {
              const isClicked = clickedLinkId === link.id;
              return (
                <a
                  key={link.id}
                  href={normalizeUrl(link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  className={`group relative flex items-center justify-between w-full p-4 transition-all duration-200 overflow-hidden ${getCardRadiusClass()} ${theme.cardBg} ${theme.cardBorder} ${getAnimationClass(
                    link.animation
                  )} ${
                    isClicked
                      ? 'scale-95 brightness-110 ring-2 ring-indigo-400'
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 text-left min-w-0 flex-1">
                    {link.icon && <span className="text-xl shrink-0">{link.icon}</span>}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-sm font-semibold truncate ${theme.cardTextColor}`}>
                          {link.title}
                        </span>
                        {link.badge && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border shrink-0 ${
                              light
                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                : 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                      {link.subtitle && (
                        <p className={`text-xs truncate mt-0.5 ${theme.cardSubtextColor}`}>
                          {link.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ExternalLink
                    className={`w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition shrink-0 ml-3 ${theme.cardTextColor}`}
                  />
                </a>
              );
            })}
        </div>

        {/* Spotify / Media Embed */}
        {widgets.spotifyUrl && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-left backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-semibold text-emerald-300">
                Featured Spotify Track
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-black/40 p-3 rounded-xl">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                  <SocialIcon platform="spotify" className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">Stream on Spotify</p>
                  <p className="text-xs text-emerald-200/70 truncate">Listen on Spotify App</p>
                </div>
              </div>
              <a
                href={normalizeUrl(widgets.spotifyUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-full transition shrink-0"
              >
                Play Now
              </a>
            </div>
          </div>
        )}

        {/* Coffee / Support Button */}
        {widgets.showCoffeeButton && (
          <div className="mt-5">
            <a
              href={`https://buymeacoffee.com/${widgets.coffeeUsername || profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/40 transition hover:scale-[1.02]"
            >
              <Coffee className="w-4 h-4 shrink-0" />
              <span className="truncate">{widgets.coffeeLabel || 'Buy Me a Coffee'}</span>
            </a>
          </div>
        )}

        {/* Direct Contact Form */}
        {widgets.showContactForm && (
          <ContactFormWidget
            contactEmail={widgets.contactEmail}
            username={profile.username}
            displayName={profile.displayName}
            light={light}
          />
        )}

        {/* Footer */}
        <div className={`mt-10 pt-6 border-t text-center ${light ? 'border-slate-200' : 'border-white/10'}`}>
          <p className={`text-xs break-words ${light ? 'text-slate-500' : 'text-white/60'}`}>
            {widgets.customFooterText || 'Powered by LinkSphere'}
          </p>
        </div>
      </div>
    </div>
  );
};

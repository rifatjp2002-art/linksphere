import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Share2, 
  QrCode, 
  ExternalLink, 
  Coffee, 
  Mail, 
  Send, 
  ArrowLeft,
  Check,
  Globe
} from 'lucide-react';
import { UserProfile, BioLink } from '../types';
import { SocialIcon } from './SocialIcons';
import confetti from 'canvas-confetti';

interface PublicBioPageProps {
  profile: UserProfile;
  onBackToEditor: () => void;
  onOpenQR: () => void;
  onOpenShare: () => void;
  onLinkClick?: (linkId: string) => void;
}

export const PublicBioPage: React.FC<PublicBioPageProps> = ({
  profile,
  onBackToEditor,
  onOpenQR,
  onOpenShare,
  onLinkClick,
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [clickedLinkId, setClickedLinkId] = useState<string | null>(null);
  const { theme, widgets } = profile;

  const handleLinkClick = (link: BioLink, e: React.MouseEvent) => {
    e.preventDefault();
    setClickedLinkId(link.id);
    if (onLinkClick) {
      onLinkClick(link.id);
    }
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.5 } });
    setTimeout(() => {
      setClickedLinkId(null);
      if (link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.startsWith('tel:')) {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    }, 350);
  };

  const getCardRadiusClass = () => {
    switch (theme.cardRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-md';
      case 'md': return 'rounded-xl';
      case 'lg': return 'rounded-2xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-2xl';
    }
  };

  const getAnimationClass = (anim?: string) => {
    switch (anim) {
      case 'pulse': return 'animate-pulse';
      case 'bounce': return 'animate-bounce';
      case 'glow': return 'ring-2 ring-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${theme.bgGradient} relative flex flex-col items-center justify-between selection:bg-indigo-500 selection:text-white pb-16`}
      style={{ fontFamily: theme.fontFamily === 'mono' ? 'monospace' : theme.fontFamily === 'serif' ? 'Georgia, serif' : 'inherit' }}
    >
      {/* Floating Top Nav for Editor Switcher & Share */}
      <div className="sticky top-4 z-40 w-full max-w-xl px-4 flex items-center justify-between">
        <button
          onClick={onBackToEditor}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg border border-white/10 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editor</span>
        </button>

        <div className="flex items-center gap-2">
          {widgets.showQRCodeButton && (
            <button
              onClick={onOpenQR}
              className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition border border-white/10 shadow-lg"
              title="QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}
          {widgets.showShareButton && (
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-lg border border-white/10 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Center Container */}
      <div className="w-full max-w-lg px-4 pt-6 text-center">
        {/* Banner */}
        {profile.bannerUrl && (
          <div className="w-full h-36 rounded-2xl overflow-hidden mb-[-48px] shadow-xl relative">
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
          <div className="w-28 h-28 rounded-full p-1.5 bg-white/20 backdrop-blur-md shadow-2xl overflow-hidden mx-auto border-2 border-white/40">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
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
              <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
            </div>
          )}
        </div>

        {/* Display Name */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <h1 className={`text-2xl font-bold tracking-tight ${theme.nameColor}`}>
            {profile.displayName || 'Your Name'}
          </h1>
          {profile.isVerified && (
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 inline" />
          )}
        </div>

        <p className="text-sm font-mono opacity-80 mt-1 text-white/90">
          @{profile.username || 'username'}
        </p>

        {/* Location & Pronouns */}
        {(profile.location || profile.pronouns) && (
          <div className="flex items-center justify-center gap-2 text-xs text-white/70 mt-2 flex-wrap">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </span>
            )}
            {profile.location && profile.pronouns && <span>•</span>}
            {profile.pronouns && <span>{profile.pronouns}</span>}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className={`text-sm mt-3.5 max-w-md mx-auto leading-relaxed whitespace-pre-line ${theme.bioColor}`}>
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
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/15 transition-all hover:scale-115 shadow-md"
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
                  href={link.url}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={`group relative flex items-center justify-between w-full p-4 transition-all duration-200 ${getCardRadiusClass()} ${theme.cardBg} ${theme.cardBorder} ${getAnimationClass(link.animation)} ${
                    isClicked ? 'scale-95 brightness-125 ring-2 ring-white' : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 text-left overflow-hidden">
                    {link.icon && (
                      <span className="text-xl shrink-0">{link.icon}</span>
                    )}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-semibold truncate ${theme.cardTextColor}`}>
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
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

                  <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition shrink-0 ml-3" />
                </a>
              );
            })}
        </div>

        {/* Spotify / Media Embed */}
        {widgets.spotifyUrl && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-semibold text-emerald-300">
                Featured Spotify Track
              </span>
            </div>
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                  <SocialIcon platform="spotify" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Stream on Spotify</p>
                  <p className="text-xs text-emerald-200/70">Listen on Spotify App</p>
                </div>
              </div>
              <a
                href={widgets.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-green-500 hover:bg-green-600 text-black text-xs font-bold rounded-full transition"
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
              <Coffee className="w-4 h-4" />
              <span>{widgets.coffeeLabel || 'Buy Me a Coffee'}</span>
            </a>
          </div>
        )}

        {/* Direct Contact Form */}
        {widgets.showContactForm && (
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-semibold text-white">
                Send Direct Message
              </span>
            </div>

            {contactSubmitted ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-center">
                <Check className="w-5 h-5 text-emerald-300 mx-auto mb-1.5" />
                <p className="text-sm font-medium text-emerald-200">
                  Message sent successfully!
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                  setTimeout(() => setContactSubmitted(false), 4000);
                }}
                className="space-y-2.5"
              >
                <input
                  type="text"
                  placeholder="Your Name / আপনার নাম"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-400"
                />
                <input
                  type="email"
                  placeholder="Your Email / ইমেইল"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-400"
                />
                <textarea
                  placeholder="Message / আপনার বার্তা লিখুন..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/20 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-400 resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/60">
            {widgets.customFooterText || 'Powered by LinkSphere'}
          </p>
        </div>
      </div>
    </div>
  );
};

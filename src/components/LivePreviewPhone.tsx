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
  Sparkles,
  Wifi,
  Battery,
  Signal,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2
} from 'lucide-react';
import { UserProfile, BioLink } from '../types';
import { SocialIcon } from './SocialIcons';
import confetti from 'canvas-confetti';

interface LivePreviewPhoneProps {
  profile: UserProfile;
  onLinkClick?: (linkId: string) => void;
  onOpenQR: () => void;
  onOpenShare: () => void;
  onOpenPublicView: () => void;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
}

export const LivePreviewPhone: React.FC<LivePreviewPhoneProps> = ({
  profile,
  onLinkClick,
  onOpenQR,
  onOpenShare,
  onOpenPublicView,
  previewDevice,
  setPreviewDevice,
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);
  const [coffeeAmount, setCoffeeAmount] = useState(3);
  const [clickedLinkId, setClickedLinkId] = useState<string | null>(null);

  const { theme, widgets } = profile;

  const handleLinkClick = (link: BioLink, e: React.MouseEvent) => {
    e.preventDefault();
    setClickedLinkId(link.id);
    if (onLinkClick) {
      onLinkClick(link.id);
    }
    confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
    setTimeout(() => {
      setClickedLinkId(null);
      if (link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.startsWith('tel:')) {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      }
    }, 400);
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
      case 'glow': return 'ring-2 ring-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-4">
      {/* Device Viewport Selector Bar */}
      <div className="flex items-center justify-between w-full max-w-sm mb-3 px-2">
        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              previewDevice === 'mobile'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              previewDevice === 'tablet'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
              previewDevice === 'desktop'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        <button
          onClick={onOpenPublicView}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full View</span>
        </button>
      </div>

      {/* Frame Container */}
      <div
        className={`transition-all duration-300 relative ${
          previewDevice === 'mobile'
            ? 'w-[360px] h-[720px] rounded-[44px] p-3.5 bg-slate-950 border-[6px] border-slate-800 shadow-2xl shadow-black/60 ring-1 ring-slate-700/50'
            : previewDevice === 'tablet'
            ? 'w-[480px] h-[720px] rounded-[36px] p-3 bg-slate-950 border-[6px] border-slate-800 shadow-2xl'
            : 'w-full max-w-[560px] h-[720px] rounded-3xl p-2 bg-slate-950 border-4 border-slate-800 shadow-2xl'
        }`}
      >
        {/* Mobile Bezel Header / Dynamic Island */}
        {previewDevice === 'mobile' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 border border-slate-700/40" />
            <div className="w-2 h-2 rounded-full bg-indigo-500/80 animate-pulse" />
          </div>
        )}

        {/* Screen Area */}
        <div
          className={`w-full h-full rounded-[34px] overflow-y-auto overflow-x-hidden relative scrollbar-none bg-gradient-to-b ${theme.bgGradient}`}
          style={{ fontFamily: theme.fontFamily === 'mono' ? 'monospace' : theme.fontFamily === 'serif' ? 'Georgia, serif' : 'inherit' }}
        >
          {/* Top Status Bar */}
          <div className="sticky top-0 z-30 flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold text-white/80 backdrop-blur-xs">
            <span>9:41</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Quick Floating Actions (Share & QR) */}
          <div className="absolute top-10 right-4 z-30 flex items-center gap-1.5">
            {widgets.showQRCodeButton && (
              <button
                onClick={onOpenQR}
                className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 hover:text-white transition shadow-sm"
                title="Show QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
            {widgets.showShareButton && (
              <button
                onClick={onOpenShare}
                className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 hover:text-white transition shadow-sm"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Optional Banner Image */}
          {profile.bannerUrl && (
            <div className="w-full h-28 relative overflow-hidden">
              <img
                src={profile.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          {/* Profile Header Content */}
          <div className={`px-5 pb-6 text-center ${profile.bannerUrl ? '-mt-10' : 'pt-4'}`}>
            {/* Avatar */}
            <div className="relative inline-block mb-3">
              <div className="w-24 h-24 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-xl overflow-hidden mx-auto border-2 border-white/40">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                  alt={profile.displayName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              {profile.isVerified && (
                <div
                  className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-0.5 shadow-md"
                  title="Verified Profile"
                >
                  <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white" />
                </div>
              )}
            </div>

            {/* Name & Badge */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h1 className={`text-lg font-bold tracking-tight ${theme.nameColor}`}>
                {profile.displayName || 'Your Name'}
              </h1>
              {profile.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 inline" />
              )}
            </div>

            <p className="text-xs font-mono opacity-75 mt-0.5 text-white/80">
              @{profile.username || 'username'}
            </p>

            {/* Pronouns & Location */}
            {(profile.location || profile.pronouns) && (
              <div className="flex items-center justify-center gap-2 text-[11px] text-white/70 mt-1.5 flex-wrap">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </span>
                )}
                {profile.location && profile.pronouns && <span>•</span>}
                {profile.pronouns && <span>{profile.pronouns}</span>}
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className={`text-xs mt-2.5 max-w-xs mx-auto leading-relaxed whitespace-pre-line ${theme.bioColor}`}>
                {profile.bio}
              </p>
            )}

            {/* Social Icons Strip */}
            {profile.socials.some((s) => s.active && s.url) && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-4 pt-1">
                {profile.socials
                  .filter((s) => s.active && s.url)
                  .map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110 shadow-sm"
                      title={social.label || social.platform}
                    >
                      <SocialIcon platform={social.platform} className="w-4 h-4" />
                    </a>
                  ))}
              </div>
            )}

            {/* Links List */}
            <div className="mt-5 space-y-3">
              {profile.links
                .filter((link) => link.active)
                .map((link) => {
                  const isClicked = clickedLinkId === link.id;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      onClick={(e) => handleLinkClick(link, e)}
                      className={`group relative flex items-center justify-between w-full p-3.5 transition-all duration-200 ${getCardRadiusClass()} ${theme.cardBg} ${theme.cardBorder} ${getAnimationClass(link.animation)} ${
                        isClicked ? 'scale-95 brightness-125 ring-2 ring-white' : 'hover:scale-[1.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left overflow-hidden">
                        {link.icon && (
                          <span className="text-lg shrink-0">{link.icon}</span>
                        )}
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs font-semibold truncate ${theme.cardTextColor}`}>
                              {link.title}
                            </span>
                            {link.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                                {link.badge}
                              </span>
                            )}
                          </div>
                          {link.subtitle && (
                            <p className={`text-[11px] truncate mt-0.5 ${theme.cardSubtextColor}`}>
                              {link.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                    </a>
                  );
                })}

              {profile.links.filter((l) => l.active).length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-white/20 text-center text-xs text-white/60">
                  No active links yet. Add your links in the Links tab!
                </div>
              )}
            </div>

            {/* Optional Widgets Section */}
            {/* 1. Spotify Embed Preview */}
            {widgets.spotifyUrl && (
              <div className="mt-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[11px] font-semibold text-emerald-300">
                    Featured Spotify Track
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                      <SocialIcon platform="spotify" className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white truncate max-w-[170px]">
                        Stream on Spotify
                      </p>
                      <p className="text-[10px] text-emerald-200/70">
                        Tap to listen on Spotify App
                      </p>
                    </div>
                  </div>
                  <a
                    href={widgets.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-black text-[11px] font-bold rounded-full transition"
                  >
                    Play
                  </a>
                </div>
              </div>
            )}

            {/* 2. Support / Coffee Button */}
            {widgets.showCoffeeButton && (
              <div className="mt-4">
                <button
                  onClick={() => setCoffeeModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/30 transition hover:scale-[1.02]"
                >
                  <Coffee className="w-4 h-4" />
                  <span>{widgets.coffeeLabel || 'Buy Me a Coffee'}</span>
                </button>
              </div>
            )}

            {/* 3. Contact Form Widget */}
            {widgets.showContactForm && (
              <div className="mt-5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs font-semibold text-white">
                    Send Direct Message
                  </span>
                </div>

                {contactSubmitted ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-center">
                    <Check className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
                    <p className="text-xs font-medium text-emerald-200">
                      Message sent! We'll reply shortly.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                      setTimeout(() => setContactSubmitted(false), 4000);
                    }}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      placeholder="Your Name / আপনার নাম"
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs text-white placeholder:text-white/40 outline-none focus:border-indigo-400"
                    />
                    <input
                      type="email"
                      placeholder="Your Email / ইমেইল"
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs text-white placeholder:text-white/40 outline-none focus:border-indigo-400"
                    />
                    <textarea
                      placeholder="Message / কী বিষয়ে যোগাযোগ করতে চান..."
                      rows={2}
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/20 text-xs text-white placeholder:text-white/40 outline-none focus:border-indigo-400 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Send className="w-3 h-3" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Custom Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] text-white/60">
                {widgets.customFooterText || 'Powered by LinkSphere'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coffee Modal Simulator */}
      {coffeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-2xl text-center">
            <Coffee className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-bold text-sm">
              Buy {profile.displayName} a Coffee
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Select amount or donate via Bkash / Card
            </p>

            <div className="flex items-center justify-center gap-2 my-4">
              {[3, 5, 10, 20].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCoffeeAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    coffeeAmount === amt
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ${amt} / ৳{amt * 120}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setCoffeeModalOpen(false);
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              Confirm Donation (${coffeeAmount})
            </button>

            <button
              onClick={() => setCoffeeModalOpen(false)}
              className="mt-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

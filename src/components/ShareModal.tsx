import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  QrCode, 
  UserCheck, 
  Share2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onOpenQR: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenQR,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.origin + '?u=' + profile.username;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVCardDownload = () => {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${profile.displayName};;;;
FN:${profile.displayName}
ORG:${profile.bio || 'LinkSphere Creator'}
TITLE:${profile.badgeText || 'Creator'}
NOTE:${profile.bio}
URL:${shareUrl}
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${profile.username}_contact.vcf`;
    link.click();
  };

  const shareItems = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 text-white hover:bg-emerald-600',
      action: () => {
        const text = encodeURIComponent(`Check out ${profile.displayName}'s bio profile & links: ${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-slate-900 text-white hover:bg-black',
      action: () => {
        const text = encodeURIComponent(`Connect with ${profile.displayName} on LinkSphere`);
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
      },
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-sky-700 text-white hover:bg-sky-800',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-amber-600 text-white hover:bg-amber-700',
      action: () => {
        const subject = encodeURIComponent(`${profile.displayName}'s Links & Profile`);
        const body = encodeURIComponent(`Hi, explore my links and socials here: ${shareUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Share Bio Link
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              linksphere.bio/{profile.username}
            </p>
          </div>
        </div>

        {/* Copy Link Field */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl mb-5">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-3 text-xs text-slate-700 dark:text-slate-200 outline-none font-mono select-all truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Social Share Grid */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Share Directly
          </label>
          <div className="grid grid-cols-5 gap-2">
            {shareItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition text-center group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition shadow-sm ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-full">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Extra Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onOpenQR();
            }}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition"
          >
            <QrCode className="w-4 h-4 text-indigo-500" />
            Show QR Code
          </button>

          <button
            onClick={handleVCardDownload}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition"
          >
            <UserCheck className="w-4 h-4 text-emerald-500" />
            Save to Contacts (.vcf)
          </button>
        </div>
      </div>
    </div>
  );
};

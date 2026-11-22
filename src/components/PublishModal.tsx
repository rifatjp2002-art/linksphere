import React, { useState } from 'react';
import {
  X,
  Rocket,
  Check,
  Copy,
  ExternalLink,
  Download,
  Github,
  Globe,
  QrCode,
  Sparkles,
  CheckCircle2,
  Cloud,
  LogIn,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { buildLiveShareUrl, generateStandaloneHtml } from '../utils/publish';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  publishedAt: string | null;
  hasUnpublishedChanges: boolean;
  isCloudConnected: boolean;
  isPublishing: boolean;
  onSignInGoogle: () => void;
  onPublishNow: () => Promise<void> | void;
  onOpenQR: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  profile,
  publishedAt,
  hasUnpublishedChanges,
  isCloudConnected,
  isPublishing,
  onSignInGoogle,
  onPublishNow,
  onOpenQR,
}) => {
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  if (!isOpen) return null;

  const cleanCloudUrl = buildLiveShareUrl(profile, false);
  const portableUrl = buildLiveShareUrl(profile, true);
  const primaryUrl = isCloudConnected ? cleanCloudUrl : portableUrl;

  const handlePublishClick = async () => {
    await onPublishNow();
    confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 } });
  };

  const handleCopyPrimary = () => {
    navigator.clipboard.writeText(primaryUrl);
    setCopiedShort(true);
    setTimeout(() => setCopiedShort(false), 2000);
  };

  const handleCopyPortable = () => {
    navigator.clipboard.writeText(portableUrl);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleDownloadHtml = () => {
    const html = generateStandaloneHtml(profile);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close publish modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              Publish & Share Live
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              পাবলিশ করলে ভিজিটররা কোনো একাউন্ট ছাড়াই আপনার লিংক দেখতে পারবেন
            </p>
          </div>
        </div>

        {/* Cloud Auth Banner when not logged in */}
        {!isCloudConnected && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 mb-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>ক্লিন লিংক (?u={profile.username}) ও ক্লাউড সেভ চান?</span>
              </p>
              <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 mt-0.5">
                Google দিয়ে লগইন করলে আপনার পেজ Firebase-এ সেভ হবে এবং যেকোনো ডিভাইস থেকে রিয়েল ভিজিট ও ক্লিক অ্যানালিটিক্স দেখাবে।
              </p>
            </div>
            <button
              type="button"
              onClick={onSignInGoogle}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Login</span>
            </button>
          </div>
        )}

        {/* Publish Status & Action Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {publishedAt && !hasUnpublishedChanges ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {publishedAt && !hasUnpublishedChanges
                    ? isCloudConnected
                      ? 'Live on Firebase Cloud!'
                      : 'Published Locally'
                    : hasUnpublishedChanges
                    ? 'You have unpublished edits'
                    : 'Ready to Publish'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {publishedAt
                    ? `Last published: ${new Date(publishedAt).toLocaleTimeString()}`
                    : 'Click Publish to save & sync your bio page'}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishClick}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm shrink-0 disabled:opacity-60 ${
                publishedAt && !hasUnpublishedChanges
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPublishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Rocket className="w-3.5 h-3.5" />
              )}
              <span>
                {isPublishing
                  ? 'Publishing...'
                  : publishedAt && !hasUnpublishedChanges
                  ? 'Re-Publish'
                  : 'Publish Live'}
              </span>
            </button>
          </div>
        </div>

        {/* Shareable Links */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {isCloudConnected
                ? '1. Clean Public Bio URL (লগইন ছাড়াই যে কেউ দেখতে পারবে)'
                : '1. Universal Portable Link (যেকোনো ডিভাইসে কাজ করবে)'}
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <input
                type="text"
                readOnly
                value={primaryUrl}
                className="flex-1 min-w-0 bg-transparent px-2.5 text-[11px] text-slate-700 dark:text-slate-200 outline-none font-mono select-all truncate"
              />
              <button
                type="button"
                onClick={handleCopyPrimary}
                className="flex items-center gap-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition shrink-0"
              >
                {copiedShort ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShort ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {isCloudConnected && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                2. Offline / Portable Backup Link
              </label>
              <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={portableUrl}
                  className="flex-1 min-w-0 bg-transparent px-2.5 text-[11px] text-slate-700 dark:text-slate-200 outline-none font-mono select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyPortable}
                  className="flex items-center gap-1 py-1.5 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition shrink-0"
                >
                  {copiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFull ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Globe className="w-4 h-4" />
              <span>Open Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenQR();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
            >
              <QrCode className="w-4 h-4 text-indigo-500" />
              <span>Get QR Code</span>
            </button>
          </div>
        </div>

        {/* GitHub Pages Deployment Box */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              GitHub Pages এ আপনার বায়ো ওয়েবসাইট বানান (ফ্রি)
            </h4>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            আপনি নিচের বাটন থেকে আপনার কাস্টমাইজ করা পেজের একদম রেডি <strong>index.html</strong> ফাইল ডাউনলোড করে সরাসরি GitHub Repository-তে আপলোড করতে পারেন, অথবা পুরো প্রজেক্ট পুশ করলে অটোমেটিক ডিপ্লয় হবে।
          </p>

          <button
            type="button"
            onClick={handleDownloadHtml}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="truncate">Download Standalone index.html</span>
          </button>
        </div>
      </div>
    </div>
  );
};

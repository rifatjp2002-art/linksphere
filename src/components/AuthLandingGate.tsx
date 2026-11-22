import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  Lock,
  Globe,
  BarChart3,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface AuthLandingGateProps {
  onSignInGoogle: () => Promise<void>;
  onViewPublicDemo: () => void;
  authError?: string | null;
}

export const AuthLandingGate: React.FC<AuthLandingGateProps> = ({
  onSignInGoogle,
  onViewPublicDemo,
  authError,
}) => {
  const [signingIn, setSigningIn] = useState(false);

  const handleLoginClick = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await onSignInGoogle();
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col">
      {/* Minimal Header */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-600/30 shrink-0">
              ⚡
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              LinkSphere
            </span>
          </div>

          <button
            type="button"
            onClick={onViewPublicDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Live Demo</span>
          </button>
        </div>
      </header>

      {/* Main Centered Auth Gate */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Security Lead-in */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Protected Creator Studio · Firebase Auth Secured</span>
          </div>

          {/* Headline & Copy */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance leading-tight">
              আপনার নিজের Bio Link ওয়েবসাইট তৈরি ও ম্যানেজ করুন
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              এডিটর, লিংক সেটিংস ও অ্যানালিটিক্স ড্যাশবোর্ড শুধুমাত্র লগইন করা একাউন্ট মালিকের জন্য। সাইন-ইন ছাড়া কেউ কোনো তথ্য দেখতে বা পরিবর্তন করতে পারবে না।
            </p>
          </div>

          {/* Error Banner (e.g. unauthorized domain) */}
          {authError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="break-words min-w-0">{authError}</span>
            </div>
          )}

          {/* Primary Google Login CTA */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={signingIn}
              onClick={handleLoginClick}
              className="w-full min-h-[48px] flex items-center justify-center gap-3 px-5 py-3 bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 rounded-xl text-sm font-bold shadow-lg transition disabled:opacity-70"
            >
              {signingIn ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
              )}
              <span>
                {signingIn ? 'Signing in...' : 'Continue with Google দিয়ে লগইন করুন'}
              </span>
            </button>

            <button
              type="button"
              onClick={onViewPublicDemo}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700/80 transition"
            >
              <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>পাবলিক বায়ো পেজ কেমন দেখায়? (Read-Only Demo)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
            </button>
          </div>

          {/* Security & Access Breakdown */}
          <div className="pt-5 border-t border-slate-800 space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-white">শুধু আপনার একাউন্টের জন্য Private Editor</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  লগইন করার পর কেবল আপনিই আপনার লিংক, প্রোফাইল ও ইমেইল এডিট করতে পারবেন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-white">ভিজিটরদের জন্য কোনো Login লাগবে না</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  আপনার শেয়ার করা <span className="font-mono text-slate-300">?u=username</span> লিংকে সবাই সরাসরি পেজ দেখতে ও মেসেজ পাঠাতে পারবে।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BarChart3 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold text-white">Private Visitor Analytics</p>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  পেজ ভিউ, ক্লিক ও ডিভাইস স্ট্যাটিস্টিকস শুধু আপনার লগইন ড্যাশবোর্ডেই দেখা যাবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

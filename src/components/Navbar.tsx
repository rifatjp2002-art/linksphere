import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  QrCode,
  Eye,
  Download,
  Upload,
  ChevronDown,
  Rocket,
  LogIn,
  LogOut,
  Cloud,
  Loader2,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/presets';

interface NavbarProps {
  currentProfile: UserProfile;
  activeTab: 'links' | 'profile' | 'themes' | 'widgets' | 'analytics';
  setActiveTab: (tab: 'links' | 'profile' | 'themes' | 'widgets' | 'analytics') => void;
  onSelectPreset: (profile: UserProfile) => void;
  onOpenQR: () => void;
  onOpenShare: () => void;
  onOpenPublish: () => void;
  hasUnpublishedChanges: boolean;
  onTogglePublicView: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  user: User | null;
  authLoading: boolean;
  isSyncingCloud: boolean;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  showMobileTabs?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  activeTab,
  setActiveTab,
  onSelectPreset,
  onOpenQR,
  onOpenShare,
  onOpenPublish,
  hasUnpublishedChanges,
  onTogglePublicView,
  onExportJson,
  onImportJson,
  user,
  authLoading,
  isSyncingCloud,
  onSignInGoogle,
  onSignOut,
  showMobileTabs = true,
}) => {
  const [presetsDropdownOpen, setPresetsDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPresetsDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'links', label: 'Links' },
    { id: 'profile', label: 'Profile' },
    { id: 'themes', label: 'Themes' },
    { id: 'widgets', label: 'Widgets' },
    { id: 'analytics', label: 'Analytics' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Wordmark (Always readable, never truncated) & Desktop Template Picker */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-600/30 shrink-0">
              ⚡
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              LinkSphere
            </span>
          </div>

          {/* Desktop Presets Selector */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setPresetsDropdownOpen(!presetsDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <span>Templates</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {presetsDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400">
                  Load Template Profile
                </div>
                {SAMPLE_PROFILES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset(sample);
                      setPresetsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex items-center justify-between gap-2 ${
                      currentProfile.id === sample.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate min-w-0 flex-1">{sample.displayName}</span>
                    <span className="text-[11px] opacity-60 font-mono shrink-0">@{sample.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Clean Typographic Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap rounded-lg ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Focused Primary Actions (Clean & Uncluttered) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Desktop Utility Buttons */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePublicView}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
              title="Full Page Preview"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={onOpenShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
              title="Share & QR"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Share</span>
            </button>
          </div>

          {/* Primary Publish CTA */}
          <button
            type="button"
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition whitespace-nowrap"
          >
            {isSyncingCloud ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            <span>Publish</span>
            {hasUnpublishedChanges && (
              <span className="text-amber-200 text-[10px] leading-none" title="Unsaved changes">
                *
              </span>
            )}
          </button>

          {/* Single Google Account Control */}
          <div className="relative" ref={accountRef}>
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              </div>
            ) : user ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1.5 p-0.5 sm:pr-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
                  title={user.email || 'Google Account'}
                >
                  <img
                    src={
                      user.photoURL ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <Cloud className="w-3.5 h-3.5 text-emerald-500 hidden sm:inline" />
                </button>

                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
                    <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'Creator Account'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                        <Cloud className="w-3 h-3" /> Cloud Sync Connected
                      </p>
                    </div>

                    <div className="pt-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onSignInGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </button>
            )}
          </div>

          {/* Overflow Menu (Mobile & Secondary Tools) */}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onTogglePublicView();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition lg:hidden"
                >
                  <Eye className="w-4 h-4 text-indigo-500" />
                  <span>Full Page Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenShare();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition lg:hidden"
                >
                  <Share2 className="w-4 h-4 text-indigo-500" />
                  <span>Share Bio Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenQR();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <QrCode className="w-4 h-4 text-indigo-500" />
                  <span>QR Code</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800 md:hidden" />

                <div className="md:hidden px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                  Switch Demo Template
                </div>
                <div className="md:hidden space-y-0.5">
                  {SAMPLE_PROFILES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        onSelectPreset(sample);
                        setMoreMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-left"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{sample.displayName}</span>
                    </button>
                  ))}
                </div>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  onClick={() => {
                    onExportJson();
                    setMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Export JSON Backup</span>
                </button>

                <label className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Import JSON Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      onImportJson(e);
                      setMoreMenuOpen(false);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clean Underline Tab Bar on Mobile/Tablet (Hidden when viewing Preview on mobile) */}
      {showMobileTabs && (
        <nav className="flex lg:hidden items-center justify-between sm:justify-start sm:gap-2 overflow-x-auto px-3 sm:px-6 border-t border-slate-200 dark:border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2.5 py-2.5 text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};

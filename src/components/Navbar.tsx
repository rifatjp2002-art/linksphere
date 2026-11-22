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
}) => {
  const [presetsDropdownOpen, setPresetsDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPresetsDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'links', label: 'Links & Items' },
    { id: 'profile', label: 'Profile & Socials' },
    { id: 'themes', label: 'Theme Studio' },
    { id: 'widgets', label: 'Widgets' },
    { id: 'analytics', label: 'Analytics' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
        {/* Zone 1: Wordmark & Preset Switcher */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/30 shrink-0">
              ⚡
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
              LinkSphere
            </span>
          </div>

          {/* Preset Selector Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setPresetsDropdownOpen(!presetsDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <span className="hidden xs:inline sm:inline">Presets</span>
              <span className="xs:hidden sm:hidden">Demo</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {presetsDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between gap-2 ${
                      currentProfile.id === sample.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate min-w-0 flex-1">{sample.displayName}</span>
                    <span className="text-[10px] opacity-60 font-mono shrink-0">@{sample.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions + Google Account */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onExportJson}
            className="hidden xl:flex items-center gap-1 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Export Profile JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            className="hidden xl:flex items-center gap-1 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Import Profile JSON"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
          </label>

          <button
            type="button"
            onClick={onTogglePublicView}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            title="Full Preview"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={onOpenQR}
            className="hidden sm:flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            title="QR Code"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden xl:inline">QR</span>
          </button>

          <button
            type="button"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden xl:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={onOpenPublish}
            className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-sm shadow-emerald-600/30 transition"
          >
            {isSyncingCloud ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            <span>Publish</span>
            {hasUnpublishedChanges && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"
                title="Unpublished changes"
              />
            )}
          </button>

          {/* Google Account Auth Control */}
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
                  className="flex items-center gap-1.5 p-0.5 pr-1.5 sm:pr-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
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
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                        <Cloud className="w-3 h-3" /> Cloud Sync Connected
                      </span>
                    </div>

                    <div className="pt-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          onExportJson();
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition xl:hidden"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export JSON Backup</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg font-semibold transition"
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
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] sm:text-xs font-bold shadow-sm transition whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Google Login</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Tabs */}
      <div className="flex lg:hidden overflow-x-auto px-3 py-2 border-t border-slate-200 dark:border-slate-800 gap-1.5 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition shrink-0 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  QrCode, 
  Eye, 
  Download, 
  Upload, 
  RefreshCw, 
  ExternalLink,
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';
import { SAMPLE_PROFILES } from '../data/presets';

interface NavbarProps {
  currentProfile: UserProfile;
  activeTab: 'links' | 'profile' | 'themes' | 'widgets' | 'analytics';
  setActiveTab: (tab: 'links' | 'profile' | 'themes' | 'widgets' | 'analytics') => void;
  onSelectPreset: (profile: UserProfile) => void;
  onOpenQR: () => void;
  onOpenShare: () => void;
  onTogglePublicView: () => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  activeTab,
  setActiveTab,
  onSelectPreset,
  onOpenQR,
  onOpenShare,
  onTogglePublicView,
  onExportJson,
  onImportJson,
}) => {
  const [presetsDropdownOpen, setPresetsDropdownOpen] = useState(false);

  const tabs = [
    { id: 'links', label: 'Links & Items' },
    { id: 'profile', label: 'Profile & Socials' },
    { id: 'themes', label: 'Theme Studio' },
    { id: 'widgets', label: 'Widgets' },
    { id: 'analytics', label: 'Analytics' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & Preset Switcher */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/30">
              ⚡
            </div>
            <a href="/" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              LinkSphere
            </a>
          </div>

          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPresetsDropdownOpen(!presetsDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <span>Demo Presets</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {presetsDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Load Template Profile
                </div>
                {SAMPLE_PROFILES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectPreset(sample);
                      setPresetsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                      currentProfile.id === sample.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{sample.displayName}</span>
                    <span className="text-[10px] opacity-60 ml-2 font-mono">@{sample.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Export / Backup Json */}
          <button
            onClick={onExportJson}
            className="hidden sm:flex items-center gap-1 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Export Profile JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            className="hidden sm:flex items-center gap-1 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Import Profile JSON"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={onImportJson} className="hidden" />
          </label>

          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">QR Code</span>
          </button>

          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/30 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Tabs */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-200 dark:border-slate-800 gap-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition ${
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

import React, { useState, useEffect } from 'react';
import { UserProfile, BioLink, ThemeConfig, WidgetSettings } from './types';
import { SAMPLE_PROFILES } from './data/presets';
import { Navbar } from './components/Navbar';
import { LinksTab } from './components/tabs/LinksTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { AppearanceTab } from './components/tabs/AppearanceTab';
import { WidgetsTab } from './components/tabs/WidgetsTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { LivePreviewPhone } from './components/LivePreviewPhone';
import { PublicBioPage } from './components/PublicBioPage';
import { QRCodeModal } from './components/QRCodeModal';
import { ShareModal } from './components/ShareModal';
import { Smartphone, Edit3, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'linksphere_profile_v1';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
    return SAMPLE_PROFILES[0];
  });

  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'themes' | 'widgets' | 'analytics'>('links');
  const [isPublicView, setIsPublicView] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'editor' | 'preview'>('editor');

  // Save to local storage whenever profile changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateLinks = (links: BioLink[]) => {
    setProfile((prev) => ({ ...prev, links }));
  };

  const handleUpdateTheme = (theme: ThemeConfig) => {
    setProfile((prev) => ({ ...prev, theme }));
  };

  const handleUpdateWidgets = (widgets: WidgetSettings) => {
    setProfile((prev) => ({ ...prev, widgets }));
  };

  // Track real-time link click
  const handleLinkClick = (linkId: string) => {
    setProfile((prev) => {
      const updatedLinks = prev.links.map((l) =>
        l.id === linkId ? { ...l, clicks: l.clicks + 1 } : l
      );
      return {
        ...prev,
        links: updatedLinks,
        analytics: {
          ...prev.analytics,
          totalClicks: prev.analytics.totalClicks + 1,
        },
      };
    });
  };

  // Simulate traffic burst
  const handleSimulateClick = () => {
    setProfile((prev) => {
      const randomLinkIndex = Math.floor(Math.random() * prev.links.length);
      const updatedLinks = prev.links.map((l, i) =>
        i === randomLinkIndex ? { ...l, clicks: l.clicks + 1 } : l
      );
      return {
        ...prev,
        links: updatedLinks,
        analytics: {
          ...prev.analytics,
          views: prev.analytics.views + Math.floor(Math.random() * 5) + 1,
          totalClicks: prev.analytics.totalClicks + 1,
        },
      };
    });
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  const handleResetAnalytics = () => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.map((l) => ({ ...l, clicks: 0 })),
      analytics: {
        ...prev.analytics,
        views: 100,
        totalClicks: 0,
      },
    }));
  };

  const handleSelectPreset = (preset: UserProfile) => {
    setProfile(preset);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.username}_linksphere_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.username && imported.links) {
          setProfile(imported);
          alert('Profile successfully imported!');
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const shareUrl = window.location.origin + '?u=' + profile.username;

  // Standalone Fullscreen Public View Mode
  if (isPublicView) {
    return (
      <>
        <PublicBioPage
          profile={profile}
          onBackToEditor={() => setIsPublicView(false)}
          onOpenQR={() => setQrModalOpen(true)}
          onOpenShare={() => setShareModalOpen(true)}
          onLinkClick={handleLinkClick}
        />
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          url={shareUrl}
          username={profile.username}
          displayName={profile.displayName}
        />
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          profile={profile}
          onOpenQR={() => {
            setShareModalOpen(false);
            setQrModalOpen(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentProfile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectPreset={handleSelectPreset}
        onOpenQR={() => setQrModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
        onTogglePublicView={() => setIsPublicView(true)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Mobile Layout Switcher Bar (Editor vs Live Preview) */}
      <div className="lg:hidden flex items-center justify-center p-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-28 z-30">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setMobileLayoutMode('editor')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              mobileLayoutMode === 'editor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Editor</span>
          </button>
          <button
            onClick={() => setMobileLayoutMode('preview')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              mobileLayoutMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Live Phone Preview</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Editor Panels */}
        <section
          className={`lg:col-span-7 space-y-6 ${
            mobileLayoutMode === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {activeTab === 'links' && (
            <LinksTab profile={profile} onUpdateLinks={handleUpdateLinks} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab profile={profile} onUpdateProfile={handleUpdateProfile} />
          )}

          {activeTab === 'themes' && (
            <AppearanceTab profile={profile} onUpdateTheme={handleUpdateTheme} />
          )}

          {activeTab === 'widgets' && (
            <WidgetsTab profile={profile} onUpdateWidgets={handleUpdateWidgets} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              profile={profile}
              onSimulateClick={handleSimulateClick}
              onResetAnalytics={handleResetAnalytics}
            />
          )}
        </section>

        {/* Right Side: Interactive Device Preview Frame */}
        <section
          className={`lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center justify-center ${
            mobileLayoutMode === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <LivePreviewPhone
            profile={profile}
            onLinkClick={handleLinkClick}
            onOpenQR={() => setQrModalOpen(true)}
            onOpenShare={() => setShareModalOpen(true)}
            onOpenPublicView={() => setIsPublicView(true)}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
          />
        </section>
      </main>

      {/* Modals */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        url={shareUrl}
        username={profile.username}
        displayName={profile.displayName}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        profile={profile}
        onOpenQR={() => {
          setShareModalOpen(false);
          setQrModalOpen(true);
        }}
      />
    </div>
  );
}

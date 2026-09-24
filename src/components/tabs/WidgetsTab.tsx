import React from 'react';
import { 
  Puzzle, 
  Coffee, 
  Mail, 
  Youtube, 
  Music, 
  QrCode, 
  Share2, 
  UserCheck,
  Globe
} from 'lucide-react';
import { UserProfile, WidgetSettings } from '../../types';

interface WidgetsTabProps {
  profile: UserProfile;
  onUpdateWidgets: (widgets: WidgetSettings) => void;
}

export const WidgetsTab: React.FC<WidgetsTabProps> = ({ profile, onUpdateWidgets }) => {
  const { widgets } = profile;

  const handleToggle = (key: keyof WidgetSettings) => {
    onUpdateWidgets({
      ...widgets,
      [key]: !widgets[key],
    });
  };

  const handleUpdate = (updates: Partial<WidgetSettings>) => {
    onUpdateWidgets({
      ...widgets,
      ...updates,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Interactive Widgets & Media Embeds
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Enable interactive features like Buy Me a Coffee, direct contact messages, and music players.
        </p>
      </div>

      {/* Support / Coffee Widget */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Buy Me a Coffee / কফি ট্রিট বাটন
              </h3>
              <p className="text-xs text-slate-500">
                Collect tips & donations from your supporters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('showCoffeeButton')}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              widgets.showCoffeeButton ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                widgets.showCoffeeButton ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {widgets.showCoffeeButton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Button Display Label
              </label>
              <input
                type="text"
                value={widgets.coffeeLabel}
                onChange={(e) => handleUpdate({ coffeeLabel: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                placeholder="Buy Me a Coffee (কফি ট্রিট)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                BuyMeACoffee Handle / Username
              </label>
              <input
                type="text"
                value={widgets.coffeeUsername}
                onChange={(e) => handleUpdate({ coffeeUsername: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500 font-mono"
                placeholder="username"
              />
            </div>
          </div>
        )}
      </div>

      {/* Direct Contact Form Widget */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Contact & Lead Capture Form
              </h3>
              <p className="text-xs text-slate-500">
                Allow visitors to send you direct inquiries
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('showContactForm')}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              widgets.showContactForm ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                widgets.showContactForm ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        {widgets.showContactForm && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Your Inquiries Receiver Email
            </label>
            <input
              type="email"
              value={widgets.contactEmail}
              onChange={(e) => handleUpdate({ contactEmail: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
              placeholder="contact@yourdomain.com"
            />
          </div>
        )}
      </div>

      {/* Spotify Media Widget */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/50 flex items-center justify-center text-green-500">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Spotify Track / Podcast Embed
            </h3>
            <p className="text-xs text-slate-500">
              Feature your newest track, podcast episode, or album
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Spotify Share URL (Leave empty to hide)
          </label>
          <input
            type="text"
            value={widgets.spotifyUrl || ''}
            onChange={(e) => handleUpdate({ spotifyUrl: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-green-500 font-mono"
            placeholder="https://open.spotify.com/track/..."
          />
        </div>
      </div>

      {/* Header Quick Buttons */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Floating Quick Action Buttons
        </h3>

        <div className="space-y-2">
          <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Show QR Code Scanner Button
              </span>
            </div>
            <input
              type="checkbox"
              checked={widgets.showQRCodeButton}
              onChange={() => handleToggle('showQRCodeButton')}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Show Share Profile Button
              </span>
            </div>
            <input
              type="checkbox"
              checked={widgets.showShareButton}
              onChange={() => handleToggle('showShareButton')}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Custom Footer Text */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-500" />
          Custom Footer Branding
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Footer Text
          </label>
          <input
            type="text"
            value={widgets.customFooterText}
            onChange={(e) => handleUpdate({ customFooterText: e.target.value })}
            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            placeholder="e.g. Made with ❤️ using LinkSphere"
          />
        </div>
      </div>
    </div>
  );
};

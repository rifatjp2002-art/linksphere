import React, { useState } from 'react';
import { 
  User, 
  CheckCircle2, 
  Image as ImageIcon, 
  MapPin, 
  Plus, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Shuffle
} from 'lucide-react';
import { UserProfile, SocialLink } from '../../types';
import { SOCIAL_PLATFORMS, SocialIcon } from '../SocialIcons';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
];

const BANNER_PRESETS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
];

export const ProfileTab: React.FC<ProfileTabProps> = ({ profile, onUpdateProfile }) => {
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState(SOCIAL_PLATFORMS[0].id);

  const handleAddSocial = () => {
    const existing = profile.socials.find((s) => s.platform === selectedSocialPlatform);
    if (existing) {
      onUpdateProfile({
        socials: profile.socials.map((s) => (s.platform === selectedSocialPlatform ? { ...s, active: true } : s)),
      });
      return;
    }

    const platformConfig = SOCIAL_PLATFORMS.find((p) => p.id === selectedSocialPlatform);
    const newSocial: SocialLink = {
      id: 'soc_' + Date.now(),
      platform: selectedSocialPlatform as any,
      url: platformConfig ? platformConfig.placeholder : '',
      active: true,
      label: platformConfig ? platformConfig.name : selectedSocialPlatform,
    };

    onUpdateProfile({
      socials: [...profile.socials, newSocial],
    });
  };

  const handleUpdateSocial = (id: string, updates: Partial<SocialLink>) => {
    onUpdateProfile({
      socials: profile.socials.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const handleDeleteSocial = (id: string) => {
    onUpdateProfile({
      socials: profile.socials.filter((s) => s.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Profile Details & Brand Identity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your photo, handle, bio, verified badge, and connected social media channels.
        </p>
      </div>

      {/* Avatar & Banner Configuration */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          Profile Photo & Banner
        </h3>

        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          {/* Avatar Preview */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md shrink-0">
            <img
              src={profile.avatarUrl || AVATAR_PRESETS[0]}
              alt={profile.displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 min-w-0 w-full space-y-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Avatar Image URL
            </label>
            <input
              type="text"
              maxLength={1000}
              value={profile.avatarUrl}
              onChange={(e) => onUpdateProfile({ avatarUrl: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
              placeholder="https://..."
            />

            {/* Avatar presets */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500">Presets:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onUpdateProfile({ avatarUrl: preset })}
                    className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition"
                  >
                    <img src={preset} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Banner Input */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Header Banner URL (Optional)
          </label>
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              maxLength={1000}
              value={profile.bannerUrl || ''}
              onChange={(e) => onUpdateProfile({ bannerUrl: e.target.value })}
              className="flex-1 min-w-0 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
              placeholder="https://images.unsplash.com/..."
            />
            {profile.bannerUrl && (
              <button
                type="button"
                onClick={() => onUpdateProfile({ bannerUrl: '' })}
                className="px-2.5 py-1.5 text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-lg hover:bg-rose-100 transition shrink-0"
              >
                Remove
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <span className="text-[11px] text-slate-500">Banner Presets:</span>
            {BANNER_PRESETS.map((b, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onUpdateProfile({ bannerUrl: b })}
                className="w-12 h-5 rounded overflow-hidden border border-slate-300 hover:scale-105 transition"
              >
                <img src={b} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Basic Bio Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Username / Handle (min 2 chars)
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5">
              <span className="text-xs text-slate-400 font-mono font-bold">@</span>
              <input
                type="text"
                maxLength={40}
                value={profile.username}
                onChange={(e) => onUpdateProfile({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                className="w-full px-1.5 py-1.5 bg-transparent text-xs text-slate-900 dark:text-white outline-none font-mono"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Display Name (English or বাংলা)
            </label>
            <input
              type="text"
              maxLength={100}
              value={profile.displayName}
              onChange={(e) => onUpdateProfile({ displayName: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              placeholder="e.g. Rifat Hasan"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Bio / Tagline
            </label>
            <span className="text-[11px] text-slate-400">
              {profile.bio.length}/300 characters
            </span>
          </div>
          <textarea
            value={profile.bio}
            onChange={(e) => onUpdateProfile({ bio: e.target.value })}
            maxLength={300}
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 leading-relaxed resize-none"
            placeholder="Write a brief intro about yourself, your work, or brand..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Location / অবস্থান
            </label>
            <input
              type="text"
              maxLength={100}
              value={profile.location || ''}
              onChange={(e) => onUpdateProfile({ location: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              placeholder="e.g. Dhaka, Bangladesh"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Pronouns (Optional)
            </label>
            <input
              type="text"
              maxLength={40}
              value={profile.pronouns || ''}
              onChange={(e) => onUpdateProfile({ pronouns: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              placeholder="e.g. he/him, they/them"
            />
          </div>
        </div>

        {/* Verified Badge Switch */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Verified Creator Badge
              </p>
              <p className="text-[11px] text-slate-500">
                Display official blue checkmark next to your name
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateProfile({ isVerified: !profile.isVerified })}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              profile.isVerified ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                profile.isVerified ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Connected Social Accounts Strip */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Social Media Icons Strip
            </h3>
            <p className="text-xs text-slate-500">
              Icons displayed directly underneath your profile header
            </p>
          </div>

          {/* Add Platform Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedSocialPlatform}
              onChange={(e) => setSelectedSocialPlatform(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddSocial}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Existing Social Accounts List */}
        <div className="space-y-2.5">
          {profile.socials.map((social) => (
            <div
              key={social.id}
              className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs shrink-0">
                <SocialIcon platform={social.platform} className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  maxLength={500}
                  value={social.url}
                  onChange={(e) => handleUpdateSocial(social.id, { url: e.target.value })}
                  placeholder={`https://${social.platform}.com/...`}
                  className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={() => handleUpdateSocial(social.id, { active: !social.active })}
                className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                  social.active
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {social.active ? 'Visible' : 'Hidden'}
              </button>

              <button
                type="button"
                onClick={() => handleDeleteSocial(social.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {profile.socials.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-3">
              No social accounts added yet. Select a platform above and click Add.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

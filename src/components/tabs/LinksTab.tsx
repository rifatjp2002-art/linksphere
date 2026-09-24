import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Flame, 
  ExternalLink, 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Activity,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { BioLink, AnimationType, UserProfile } from '../../types';

interface LinksTabProps {
  profile: UserProfile;
  onUpdateLinks: (links: BioLink[]) => void;
}

const EMOJI_SUGGESTIONS = ['🔥', '💻', '🚀', '📦', '☕', '🎨', '🎧', '🎟️', '🛍️', '📱', '✨', '⚡', '💡', '🎓', '📺', '🌐'];

export const LinksTab: React.FC<LinksTabProps> = ({ profile, onUpdateLinks }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddLink = () => {
    const newLink: BioLink = {
      id: 'link_' + Date.now(),
      title: 'New Social or Project Link',
      subtitle: 'Short descriptive subtext',
      url: 'https://',
      active: true,
      icon: '🔗',
      highlight: false,
      animation: 'none',
      clicks: 0,
    };
    onUpdateLinks([newLink, ...profile.links]);
    setEditingId(newLink.id);
  };

  const handleUpdateLink = (id: string, updates: Partial<BioLink>) => {
    const updated = profile.links.map((link) => (link.id === id ? { ...link, ...updates } : link));
    onUpdateLinks(updated);
  };

  const handleDeleteLink = (id: string) => {
    onUpdateLinks(profile.links.filter((l) => l.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= profile.links.length) return;
    const newLinks = [...profile.links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    onUpdateLinks(newLinks);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Manage Links & Highlights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add custom buttons, affiliate links, portfolios and products with animations.
          </p>
        </div>

        <button
          onClick={handleAddLink}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Quick Category Templates */}
      <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Quick Preset Ideas:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { title: '🎥 Latest YouTube Video', icon: '📺', url: 'https://youtube.com' },
            { title: '💼 Hire Me / Portfolio', icon: '💼', url: 'https://behance.net' },
            { title: '💬 WhatsApp Direct Chat', icon: '💬', url: 'https://wa.me/' },
            { title: '🛒 My Online Store / Merch', icon: '🛍️', url: 'https://' },
          ].map((preset) => (
            <button
              key={preset.title}
              onClick={() => {
                const newLink: BioLink = {
                  id: 'link_' + Date.now(),
                  title: preset.title,
                  url: preset.url,
                  active: true,
                  icon: preset.icon,
                  clicks: 0,
                  animation: 'none',
                };
                onUpdateLinks([newLink, ...profile.links]);
              }}
              className="px-2.5 py-1 text-[11px] bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg transition"
            >
              + {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {profile.links.map((link, index) => {
          const isEditing = editingId === link.id;

          return (
            <div
              key={link.id}
              className={`p-4 rounded-xl border transition-all ${
                link.active
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-70'
              }`}
            >
              {/* Row Top Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col text-slate-400">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === profile.links.length - 1}
                      className="hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-lg">{link.icon || '🔗'}</span>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {link.title || 'Untitled Link'}
                      {link.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded">
                          {link.badge}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate max-w-[260px]">
                      {link.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Click Counter Badge */}
                  <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <Activity className="w-3 h-3 text-indigo-500" />
                    {link.clicks} clicks
                  </span>

                  {/* Active Toggle */}
                  <button
                    onClick={() => handleUpdateLink(link.id, { active: !link.active })}
                    className={`p-1.5 rounded-lg transition ${
                      link.active
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                    }`}
                    title={link.active ? 'Hide link' : 'Show link'}
                  >
                    {link.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Toggle */}
                  <button
                    onClick={() => setEditingId(isEditing ? null : link.id)}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                  >
                    {isEditing ? 'Close' : 'Edit'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editing Form Expansion */}
              {isEditing && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Link Title / শিরোনাম
                      </label>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleUpdateLink(link.id, { title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                        placeholder="e.g. Subscribe to my YouTube"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Destination URL / লিংক
                      </label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Subtitle / সংক্ষিপ্ত বিবরণ (Optional)
                      </label>
                      <input
                        type="text"
                        value={link.subtitle || ''}
                        onChange={(e) => handleUpdateLink(link.id, { subtitle: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                        placeholder="e.g. New video every Friday"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Badge Tag (e.g. NEW, 50% OFF, HOT)
                      </label>
                      <input
                        type="text"
                        value={link.badge || ''}
                        onChange={(e) => handleUpdateLink(link.id, { badge: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                        placeholder="e.g. FEATURED"
                      />
                    </div>
                  </div>

                  {/* Icon & Animation Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Choose Emoji / Icon:
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {EMOJI_SUGGESTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleUpdateLink(link.id, { icon: emoji })}
                            className={`w-7 h-7 text-sm rounded-lg flex items-center justify-center transition ${
                              link.icon === emoji
                                ? 'bg-indigo-600 text-white scale-110 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Attention Animation:
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(['none', 'pulse', 'glow', 'bounce'] as AnimationType[]).map((anim) => (
                          <button
                            key={anim}
                            type="button"
                            onClick={() => handleUpdateLink(link.id, { animation: anim })}
                            className={`px-2.5 py-1 text-xs font-medium capitalize rounded-lg transition ${
                              (link.animation || 'none') === anim
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {anim}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {profile.links.length === 0 && (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <LinkIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No links yet
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Click the "Add Link" button above to create your first bio link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

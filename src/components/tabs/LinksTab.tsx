import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Activity,
  Link as LinkIcon,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { BioLink, AnimationType, UserProfile } from '../../types';
import { normalizeUrl, isValidLinkUrl } from '../../utils/publish';

interface LinksTabProps {
  profile: UserProfile;
  onUpdateLinks: (links: BioLink[]) => void;
}

const EMOJI_SUGGESTIONS = ['🔗', '🔥', '💻', '🚀', '📦', '☕', '🎨', '🎧', '🎟️', '🛍️', '📱', '✨', '⚡', '💡', '🎓', '📺', '🌐'];

export const LinksTab: React.FC<LinksTabProps> = ({ profile, onUpdateLinks }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New Link Composer State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newIcon, setNewIcon] = useState('🔗');
  const [newAnimation, setNewAnimation] = useState<AnimationType>('none');
  const [formError, setFormError] = useState('');

  const resetComposer = () => {
    setNewTitle('');
    setNewUrl('');
    setNewSubtitle('');
    setNewBadge('');
    setNewIcon('🔗');
    setNewAnimation('none');
    setFormError('');
  };

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormError('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = newTitle.trim();
    const cleanUrl = newUrl.trim();

    if (!cleanTitle) {
      setFormError('লিংকের শিরোনাম (Title) লিখুন।');
      return;
    }
    if (!isValidLinkUrl(cleanUrl)) {
      setFormError('সঠিক ওয়েবসাইট URL দিন (যেমন: youtube.com/@name অথবা https://...)');
      return;
    }

    const created: BioLink = {
      id: 'link_' + Date.now(),
      title: cleanTitle,
      subtitle: newSubtitle.trim() || undefined,
      url: normalizeUrl(cleanUrl),
      active: true,
      icon: newIcon,
      highlight: newAnimation !== 'none',
      animation: newAnimation,
      clicks: 0,
      badge: newBadge.trim() || undefined,
    };

    onUpdateLinks([created, ...profile.links]);
    resetComposer();
    setIsCreating(false);
  };

  const handleUpdateLink = (id: string, updates: Partial<BioLink>) => {
    const updated = profile.links.map((link) => (link.id === id ? { ...link, ...updates } : link));
    onUpdateLinks(updated);
  };

  const handleUrlBlur = (id: string, currentUrl: string) => {
    if (currentUrl.trim() && currentUrl.trim() !== 'https://' && currentUrl.trim() !== 'http://') {
      handleUpdateLink(id, { url: normalizeUrl(currentUrl) });
    }
  };

  const handleDeleteLink = (id: string) => {
    onUpdateLinks(profile.links.filter((l) => l.id !== id));
    if (editingId === id) setEditingId(null);
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
    <div className="space-y-5">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Manage Links & Highlights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add custom buttons, affiliate links, portfolios and products with animations.
          </p>
        </div>

        {!isCreating && (
          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Link</span>
          </button>
        )}
      </div>

      {/* Create New Link Composer Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500/60 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" />
              Create New Bio Link
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                resetComposer();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Link Title / শিরোনাম *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                placeholder="e.g. Watch My YouTube Channel"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Destination URL / লিংক *
              </label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                placeholder="e.g. youtube.com/@yourname"
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
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                placeholder="e.g. New tutorials every week"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Badge Tag (Optional)
              </label>
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                placeholder="e.g. NEW, HOT, FREE"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Icon / Emoji
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {EMOJI_SUGGESTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewIcon(emoji)}
                    className={`w-7 h-7 text-sm rounded-lg flex items-center justify-center transition ${
                      newIcon === emoji
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
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Attention Animation
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['none', 'pulse', 'glow', 'bounce'] as AnimationType[]).map((anim) => (
                  <button
                    key={anim}
                    type="button"
                    onClick={() => setNewAnimation(anim)}
                    className={`px-2.5 py-1 text-xs font-medium capitalize rounded-lg transition ${
                      newAnimation === anim
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

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                resetComposer();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Check className="w-4 h-4" />
              Save & Add Link
            </button>
          </div>
        </form>
      )}

      {/* Quick Category Templates */}
      <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          Quick Preset Ideas:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { title: 'Latest YouTube Video', icon: '📺', url: 'https://youtube.com' },
            { title: 'Hire Me / Portfolio', icon: '💼', url: 'https://behance.net' },
            { title: 'WhatsApp Direct Chat', icon: '💬', url: 'https://wa.me/8801700000000' },
            { title: 'My Online Store / Merch', icon: '🛍️', url: 'https://gumroad.com' },
          ].map((preset) => (
            <button
              key={preset.title}
              type="button"
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
                setEditingId(newLink.id);
                setIsCreating(false);
              }}
              className="px-2.5 py-1 text-[11px] bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg transition"
            >
              + {preset.icon} {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {profile.links.map((link, index) => {
          const isEditing = editingId === link.id;
          const validUrl = isValidLinkUrl(link.url);

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
              <div className="flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1 w-full sm:w-auto">
                  <div className="flex flex-col text-slate-400 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === profile.links.length - 1}
                      className="hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20 transition"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-lg shrink-0">{link.icon || '🔗'}</span>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 min-w-0">
                      <span className="truncate">{link.title || 'Untitled Link'}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded shrink-0">
                          {link.badge}
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate flex-1">
                        {link.url}
                      </p>
                      {!validUrl && (
                        <span className="text-[10px] text-amber-500 font-medium shrink-0">
                          (Needs valid URL)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Click Counter Badge */}
                  <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                    <Activity className="w-3 h-3 text-indigo-500" />
                    {link.clicks} clicks
                  </span>

                  {/* Test Open Link */}
                  {validUrl && (
                    <a
                      href={normalizeUrl(link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      title="Test open link in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Active Toggle */}
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : link.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                      isEditing
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isEditing ? 'Done' : 'Edit'}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
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
                        onBlur={() => handleUrlBlur(link.id, link.url)}
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                        placeholder="https://youtube.com/..."
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
            <p className="text-xs text-slate-500 mt-0.5 mb-3">
              Click the "Create New Link" button above to add your first bio link.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateForm}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
            >
              + Create First Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

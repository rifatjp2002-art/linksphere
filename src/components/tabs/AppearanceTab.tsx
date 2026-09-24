import React from 'react';
import { 
  Palette, 
  Sparkles, 
  Layout, 
  Type, 
  Check, 
  Sliders,
  SunMedium
} from 'lucide-react';
import { UserProfile, ThemeConfig, CardRadius, CardStyle, FontFamily } from '../../types';
import { PRESET_THEMES } from '../../data/themes';

interface AppearanceTabProps {
  profile: UserProfile;
  onUpdateTheme: (theme: ThemeConfig) => void;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ profile, onUpdateTheme }) => {
  const currentTheme = profile.theme;

  const handleSelectPreset = (preset: ThemeConfig) => {
    onUpdateTheme({
      ...preset,
    });
  };

  const handleUpdateCurrentTheme = (updates: Partial<ThemeConfig>) => {
    onUpdateTheme({
      ...currentTheme,
      ...updates,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Themes & Visual Branding Studio
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Pick a curated designer aesthetic or fine-tune button corner radius, glass effects, and typography.
        </p>
      </div>

      {/* Preset Themes Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Curated Theme Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_THEMES.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectPreset(theme)}
                className={`relative flex flex-col p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-lg scale-[1.02]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                {/* Mini Visual Preview Box */}
                <div
                  className={`w-full h-18 rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 mb-2.5 overflow-hidden bg-gradient-to-b ${theme.bgGradient}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white/40 border border-white/60" />
                  <div className={`w-3/4 h-2 rounded-md ${theme.cardBg} border ${theme.cardBorder}`} />
                  <div className={`w-3/4 h-2 rounded-md ${theme.cardBg} border ${theme.cardBorder}`} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {theme.name}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {theme.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Button Corner Radius Customizer */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Layout className="w-4 h-4 text-indigo-500" />
          Link Button Corner Shape
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'none', label: 'Square', radius: 'rounded-none' },
            { id: 'sm', label: 'Slight', radius: 'rounded-sm' },
            { id: 'md', label: 'Standard', radius: 'rounded-xl' },
            { id: 'lg', label: 'Large', radius: 'rounded-2xl' },
            { id: 'full', label: 'Pill', radius: 'rounded-full' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleUpdateCurrentTheme({ cardRadius: item.id as CardRadius })}
              className={`flex flex-col items-center gap-2 p-2.5 border rounded-xl transition ${
                currentTheme.cardRadius === item.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`w-8 h-4 bg-slate-300 dark:bg-slate-700 ${item.radius}`} />
              <span className="text-[11px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Button Glass & Style Customizer */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          Surface Style & Glassmorphism
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            {
              id: 'glass',
              label: 'Glassmorphism',
              desc: 'Frosted transparent blur',
              cardBg: 'bg-white/10 backdrop-blur-md hover:bg-white/20',
              cardBorder: 'border border-white/20 shadow-lg',
            },
            {
              id: 'flat',
              label: 'Solid Flat',
              desc: 'High contrast solid card',
              cardBg: 'bg-slate-800/90 hover:bg-slate-800',
              cardBorder: 'border border-slate-700 shadow-md',
            },
            {
              id: 'neon',
              label: 'Neon Border',
              desc: 'Luminous cyan/indigo glow',
              cardBg: 'bg-zinc-950/80 hover:bg-zinc-900',
              cardBorder: 'border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
            },
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() =>
                handleUpdateCurrentTheme({
                  cardStyle: style.id as CardStyle,
                  cardBg: style.cardBg,
                  cardBorder: style.cardBorder,
                })
              }
              className={`p-3 rounded-xl border text-left transition ${
                currentTheme.cardStyle === style.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {style.label}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {style.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Typography Selector */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-indigo-500" />
          Font Family & Typography Pairings
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'sans', label: 'Modern Sans', preview: 'Aa - Plus Jakarta / Inter', font: 'font-sans' },
            { id: 'serif', label: 'Editorial Serif', preview: 'Aa - Lora / Garamond', font: 'font-serif' },
            { id: 'mono', label: 'Developer Mono', preview: 'Aa - JetBrains Mono', font: 'font-mono' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleUpdateCurrentTheme({ fontFamily: f.id as FontFamily })}
              className={`p-3 rounded-xl border text-left transition ${
                currentTheme.fontFamily === f.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs font-bold block">{f.label}</span>
              <span className={`text-[11px] text-slate-500 dark:text-slate-400 mt-1 block ${f.font}`}>
                {f.preview}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

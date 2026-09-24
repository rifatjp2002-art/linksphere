import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointerClick, 
  Eye, 
  Percent, 
  Smartphone, 
  Monitor, 
  Share2, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AnalyticsTabProps {
  profile: UserProfile;
  onSimulateClick: () => void;
  onResetAnalytics: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  profile,
  onSimulateClick,
  onResetAnalytics,
}) => {
  const { analytics, links } = profile;

  // Calculate live stats
  const totalViews = analytics.views;
  const totalClicks = links.reduce((acc, l) => acc + l.clicks, analytics.totalClicks);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  // Sort links by clicks
  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks);
  const maxClicks = Math.max(...links.map((l) => l.clicks), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Audience & Link Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time click conversions, traffic referrers, and device breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Visit + Click</span>
          </button>

          <button
            onClick={onResetAnalytics}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Reset metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Page Views
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {totalViews.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +18.4% this week
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Link Clicks
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {totalClicks.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +24.1% conversions
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Average CTR
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {ctr}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            High intent visitor engagement
          </span>
        </div>
      </div>

      {/* Daily Visits Trend Bar Chart */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          7-Day Activity & Engagement
        </h3>

        <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
          {analytics.dailyStats.map((d, i) => {
            const heightPercent = Math.round((d.views / 1100) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center h-28 gap-1">
                  {/* Views bar */}
                  <div
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    className="w-1/2 bg-indigo-500/80 group-hover:bg-indigo-500 rounded-t-md transition-all relative"
                    title={`${d.views} views`}
                  />
                  {/* Clicks bar */}
                  <div
                    style={{ height: `${Math.max(Math.round((d.clicks / 1100) * 100), 5)}%` }}
                    className="w-1/2 bg-emerald-400 group-hover:bg-emerald-300 rounded-t-md transition-all"
                    title={`${d.clicks} clicks`}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400">{d.date}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-xs" />
            <span>Profile Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-xs" />
            <span>Link Clicks</span>
          </div>
        </div>
      </div>

      {/* Top Performing Links Table */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Top Performing Links
        </h3>

        <div className="space-y-3">
          {sortedLinks.map((link, index) => {
            const pct = Math.round((link.clicks / maxClicks) * 100);
            return (
              <div key={link.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[280px]">
                    <span className="font-mono text-slate-400 text-[11px]">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {link.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    {link.clicks} clicks
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}

          {sortedLinks.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">
              No links available to rank.
            </p>
          )}
        </div>
      </div>

      {/* Referrers & Devices Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Referrers */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Top Traffic Referrers
          </h3>
          <div className="space-y-2.5">
            {analytics.referrerStats.map((ref) => (
              <div key={ref.source} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {ref.source}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400">{ref.count}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                    {ref.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Visitor Devices
          </h3>
          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                  Mobile Smartphones
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {analytics.deviceStats.mobile}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${analytics.deviceStats.mobile}%` }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Monitor className="w-3.5 h-3.5 text-blue-500" />
                  Desktop & Laptops
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {analytics.deviceStats.desktop}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${analytics.deviceStats.desktop}%` }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

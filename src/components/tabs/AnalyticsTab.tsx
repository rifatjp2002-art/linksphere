import React from 'react';
import {
  BarChart3,
  MousePointerClick,
  Eye,
  Percent,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  RefreshCw,
  Cloud,
  LogIn,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AnalyticsTabProps {
  profile: UserProfile;
  isCloudConnected: boolean;
  onSignInGoogle: () => void;
  onSimulateClick: () => void;
  onResetAnalytics: () => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  profile,
  isCloudConnected,
  onSignInGoogle,
  onSimulateClick,
  onResetAnalytics,
}) => {
  const { analytics, links } = profile;

  const totalViews = analytics.views;
  const linkClicksSum = links.reduce((acc, l) => acc + l.clicks, 0);
  const totalClicks = isCloudConnected
    ? analytics.totalClicks
    : Math.max(linkClicksSum, analytics.totalClicks);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks);
  const maxClicks = Math.max(...links.map((l) => l.clicks), 1);
  const maxDailyStat = Math.max(
    ...analytics.dailyStats.map((d) => Math.max(d.views, d.clicks)),
    10
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">Audience & Link Performance</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isCloudConnected
              ? 'Real-time cross-device analytics from Firestore for all public visitors.'
              : 'Preview analytics in this browser. Sign in with Google for cross-device tracking.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isCloudConnected && (
            <button
              type="button"
              onClick={onSimulateClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-semibold transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Visit + Click</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetAnalytics}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl transition"
            title="Reset all stats to 0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to 0</span>
          </button>
        </div>
      </div>

      {/* Live Cloud Tracking Status Banner */}
      {isCloudConnected ? (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
          <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <strong>Live Cross-Device Analytics চালু আছে!</strong> আপনার পাবলিক লিংক (
            <span className="font-mono">?u={profile.username}</span>) যেকোনো মানুষ যেকোনো মোবাইল বা কম্পিউটার থেকে ভিজিট করলে বা লিংকে ক্লিক করলে (কোনো একাউন্ট ছাড়াই!) সেটি রিয়েল-টাইমে এখানে আপডেট হবে।
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between flex-wrap gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <div className="min-w-0 flex-1">
            <strong>ক্রস-ডিভাইস রিয়েল অ্যানালিটিক্স পেতে Google Login করুন:</strong> বর্তমানে শুধু এই ব্রাউজারের লোকাল টেস্ট ডেটা দেখাচ্ছে। Google দিয়ে সাইন ইন করে পাবলিশ করলে বিশ্বের যেকোনো ভিজিটরের ভিউ ও ক্লিক সরাসরি এখানে কাউন্ট হবে।
          </div>
          <button
            type="button"
            onClick={onSignInGoogle}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign in with Google</span>
          </button>
        </div>
      )}

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
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isCloudConnected ? 'Synced from public visitors' : 'Local browser view counter'}
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
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {links.filter((l) => l.active).length} active links
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
            Clicks / Views ratio
          </span>
        </div>
      </div>

      {/* Daily Visits Trend Bar Chart */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          7-Day Activity & Engagement
        </h3>

        <div className="h-40 flex items-end justify-between gap-1.5 sm:gap-2 pt-4 px-1 sm:px-2">
          {analytics.dailyStats.map((d, i) => {
            const heightPercent = Math.min(Math.round((d.views / maxDailyStat) * 100), 100);
            const clickPercent = Math.min(Math.round((d.clicks / maxDailyStat) * 100), 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group min-w-0">
                <div className="w-full flex items-end justify-center h-28 gap-0.5 sm:gap-1">
                  <div
                    style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    className="w-1/2 bg-indigo-500/80 group-hover:bg-indigo-500 rounded-t-md transition-all relative"
                    title={`${d.views} views`}
                  />
                  <div
                    style={{ height: `${Math.max(clickPercent, 4)}%` }}
                    className="w-1/2 bg-emerald-400 group-hover:bg-emerald-300 rounded-t-md transition-all"
                    title={`${d.clicks} clicks`}
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate">
                  {d.date}
                </span>
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
                <div className="flex items-center justify-between gap-3 text-xs min-w-0">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono text-slate-400 text-[11px] shrink-0">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {link.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
                    {link.clicks} clicks
                  </span>
                </div>
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
            {analytics.referrerStats.length > 0 ? (
              analytics.referrerStats.map((ref) => (
                <div key={ref.source} className="flex items-center justify-between gap-2 text-xs min-w-0">
                  <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                    {ref.source}
                  </span>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span className="text-slate-400">{ref.count}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">
                      {ref.percentage}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-2">
                No visitor referrers recorded yet.
              </p>
            )}
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
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  Mobile
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
                  <Monitor className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  Desktop
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

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Tablet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Tablet
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {analytics.deviceStats.tablet}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${analytics.deviceStats.tablet}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

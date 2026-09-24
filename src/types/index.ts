export type AnimationType = 'none' | 'pulse' | 'bounce' | 'glow' | 'shake';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type CardStyle = 'flat' | 'outline' | 'glass' | 'shadow3d' | 'neon' | 'soft';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'bengali';

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'github' | 'tiktok' | 'whatsapp' | 'telegram' | 'discord' | 'spotify' | 'email' | 'phone' | 'website';
  url: string;
  active: boolean;
  label?: string;
}

export interface BioLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  active: boolean;
  icon?: string;
  highlight?: boolean;
  animation?: AnimationType;
  clicks: number;
  badge?: string;
  category?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  backgroundType: 'solid' | 'gradient' | 'mesh' | 'glass' | 'image';
  bgGradient: string;
  pageBgColor: string;
  cardBg: string;
  cardBorder: string;
  cardTextColor: string;
  cardSubtextColor: string;
  cardRadius: CardRadius;
  cardStyle: CardStyle;
  nameColor: string;
  bioColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  previewBg: string;
}

export interface WidgetSettings {
  showContactForm: boolean;
  contactEmail: string;
  showCoffeeButton: boolean;
  coffeeUsername: string;
  coffeeLabel: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  customFooterText: string;
  showShareButton: boolean;
  showQRCodeButton: boolean;
  showVCardDownload: boolean;
}

export interface AnalyticsData {
  views: number;
  totalClicks: number;
  dailyStats: Array<{ date: string; views: number; clicks: number }>;
  referrerStats: Array<{ source: string; count: number; percentage: number }>;
  deviceStats: { mobile: number; desktop: number; tablet: number };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  location?: string;
  pronouns?: string;
  avatarUrl: string;
  bannerUrl?: string;
  isVerified: boolean;
  badgeText?: string;
  socials: SocialLink[];
  links: BioLink[];
  theme: ThemeConfig;
  widgets: WidgetSettings;
  analytics: AnalyticsData;
}

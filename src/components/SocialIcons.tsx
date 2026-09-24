import React from 'react';
import { 
  Youtube, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  MessageCircle, 
  Send, 
  Music, 
  Mail, 
  Phone, 
  Globe, 
  Flame,
  Radio
} from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-5 h-5' }) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return <Youtube className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'twitter':
    case 'x':
      return <Twitter className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'github':
      return <Github className={className} />;
    case 'whatsapp':
      return <MessageCircle className={className} />;
    case 'telegram':
      return <Send className={className} />;
    case 'discord':
      return <Flame className={className} />;
    case 'spotify':
      return <Radio className={className} />;
    case 'tiktok':
      return <Music className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'phone':
      return <Phone className={className} />;
    case 'website':
    default:
      return <Globe className={className} />;
  }
};

export const SOCIAL_PLATFORMS = [
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@channel', color: 'hover:text-red-500' },
  { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/username', color: 'hover:text-blue-500' },
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/username', color: 'hover:text-pink-500' },
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', color: 'hover:text-sky-600' },
  { id: 'github', name: 'GitHub', placeholder: 'https://github.com/username', color: 'hover:text-slate-200' },
  { id: 'twitter', name: 'X (Twitter)', placeholder: 'https://x.com/username', color: 'hover:text-sky-400' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/88017XXXXXXXX', color: 'hover:text-emerald-500' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/username', color: 'hover:text-cyan-400' },
  { id: 'discord', name: 'Discord', placeholder: 'https://discord.gg/invitecode', color: 'hover:text-indigo-400' },
  { id: 'spotify', name: 'Spotify', placeholder: 'https://open.spotify.com/artist/...', color: 'hover:text-green-500' },
  { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@username', color: 'hover:text-rose-500' },
  { id: 'email', name: 'Email Address', placeholder: 'mailto:yourname@email.com', color: 'hover:text-amber-400' },
  { id: 'phone', name: 'Phone Call', placeholder: 'tel:+8801700000000', color: 'hover:text-teal-400' },
  { id: 'website', name: 'Personal Website', placeholder: 'https://yourwebsite.com', color: 'hover:text-violet-400' },
] as const;

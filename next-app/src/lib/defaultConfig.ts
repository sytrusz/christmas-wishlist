import { SiteConfig, SiteThemeColors } from '@/types/config';

export const DEFAULT_THEME_COLORS: SiteThemeColors = {
  bg: '#F7F3E8',
  primary: '#581825',
  primaryHover: '#43111B',
  secondary: '#1E4D38',
  secondaryHover: '#153A2A',
  headerText: '#4A1521',
  subtitleText: '#6E5D4F',
  footerBg: '#144730',
  cardBorder: '#C9AE8D',
};

export const THEME_PRESETS: Record<string, { name: string; colors: SiteThemeColors }> = {
  holiday_plaid: {
    name: 'Holiday Plaid (Default)',
    colors: {
      bg: '#F7F3E8',
      primary: '#581825',
      primaryHover: '#43111B',
      secondary: '#1E4D38',
      secondaryHover: '#153A2A',
      headerText: '#4A1521',
      subtitleText: '#6E5D4F',
      footerBg: '#144730',
      cardBorder: '#C9AE8D',
    },
  },
  classic_christmas: {
    name: 'Classic Christmas',
    colors: {
      bg: '#FAF5EE',
      primary: '#C21807',
      primaryHover: '#9A1305',
      secondary: '#1B4D3E',
      secondaryHover: '#12382C',
      headerText: '#8B0000',
      subtitleText: '#5A4A42',
      footerBg: '#133926',
      cardBorder: '#C4A482',
    },
  },
  winter_wonderland: {
    name: 'Winter Wonderland',
    colors: {
      bg: '#F0F6FA',
      primary: '#1E3A8A',
      primaryHover: '#172554',
      secondary: '#0284C7',
      secondaryHover: '#0369A1',
      headerText: '#0F172A',
      subtitleText: '#475569',
      footerBg: '#0F172A',
      cardBorder: '#93C5FD',
    },
  },
  modern_neutral: {
    name: 'Modern Minimalist',
    colors: {
      bg: '#F8FAFC',
      primary: '#4F46E5',
      primaryHover: '#3730A3',
      secondary: '#059669',
      secondaryHover: '#047857',
      headerText: '#1E293B',
      subtitleText: '#64748B',
      footerBg: '#0F172A',
      cardBorder: '#CBD5E1',
    },
  },
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  eventTitle: 'Christmas Wishlist 2026',
  eventSubtitle: "Tis' the season… to politely ask for gifts.",
  eventEmoji: '🎄',
  themePreset: 'holiday_plaid',
  colors: DEFAULT_THEME_COLORS,
  banner: {
    enabled: true,
    imageUrl: '/holiday-plaid-theme-banner.jpg',
    altText: 'Family Event Dress Theme: Holiday Plaid',
    modalEnabled: true,
    modalTitle: 'HOLIDAY PLAID',
    modalSubtitle: 'Burgundy • Hunter Green • Ivory • Camel • Plaid',
    modalImageUrl: '/holiday-plaid-full-guide.jpg',
    ribbonEnabled: true,
    ribbonTileUrl: '/tartan-tile.png',
  },
  categories: [
    { key: 'ADULT', label: 'Adults', emoji: '👨' },
    { key: 'KID', label: 'Kids', emoji: '👶' },
    { key: 'PET', label: 'Pets', emoji: '🐾' },
  ],
};

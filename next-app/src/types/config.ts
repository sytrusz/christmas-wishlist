export interface SiteThemeColors {
  bg: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  headerText: string;
  subtitleText: string;
  footerBg: string;
  cardBorder: string;
}

export interface SiteCategory {
  key: string;
  label: string;
  emoji: string;
}

export interface SiteBannerConfig {
  enabled: boolean;
  imageUrl: string;
  altText: string;
  modalEnabled: boolean;
  modalTitle: string;
  modalSubtitle: string;
  modalImageUrl: string;
  ribbonEnabled: boolean;
  ribbonTileUrl: string;
}

export interface SiteConfig {
  eventTitle: string;
  eventSubtitle: string;
  eventEmoji: string;
  themePreset: string;
  colors: SiteThemeColors;
  banner: SiteBannerConfig;
  categories: SiteCategory[];
}

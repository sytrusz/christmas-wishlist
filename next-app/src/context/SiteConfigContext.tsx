'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteConfig } from '@/types/config';
import { DEFAULT_SITE_CONFIG } from '@/lib/defaultConfig';
import { settingsAPI } from '@/services/api';

interface SiteConfigContextType {
  config: SiteConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  updateConfigLocally: (updated: Partial<SiteConfig>) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: DEFAULT_SITE_CONFIG,
  loading: true,
  refreshConfig: async () => {},
  updateConfigLocally: () => {},
});

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  const applyColorsToDOM = (colors: SiteConfig['colors']) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', colors.bg);
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-primary-hover', colors.primaryHover || colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-secondary-hover', colors.secondaryHover || colors.secondary);
    root.style.setProperty('--theme-header-text', colors.headerText);
    root.style.setProperty('--theme-subtitle-text', colors.subtitleText);
    root.style.setProperty('--theme-footer-bg', colors.footerBg);
    root.style.setProperty('--theme-card-border', colors.cardBorder);
    document.body.style.backgroundColor = colors.bg;
  };

  const refreshConfig = async () => {
    try {
      const res = await settingsAPI.getConfig();
      if (res.data) {
        setConfig(res.data);
        applyColorsToDOM(res.data.colors);
      }
    } catch (err) {
      console.error('Failed to load site config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  useEffect(() => {
    if (config.colors) {
      applyColorsToDOM(config.colors);
    }
  }, [config.colors]);

  const updateConfigLocally = (updated: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updated };
      if (updated.colors) {
        applyColorsToDOM({ ...prev.colors, ...updated.colors });
      }
      return next;
    });
  };

  return (
    <SiteConfigContext.Provider value={{ config, loading, refreshConfig, updateConfigLocally }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}

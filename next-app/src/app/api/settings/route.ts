import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';
import { DEFAULT_SITE_CONFIG } from '@/lib/defaultConfig';
import { SiteConfig } from '@/types/config';

const CONFIG_KEY = 'site_config';
const LEGACY_HEADER_KEY = 'header_title';

export async function GET() {
  try {
    const configSetting = await db.siteSetting.findUnique({
      where: { key: CONFIG_KEY },
    });

    if (configSetting?.value) {
      try {
        const parsed = JSON.parse(configSetting.value);
        // Merge with defaults to ensure all properties exist
        const merged: SiteConfig = {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          colors: { ...DEFAULT_SITE_CONFIG.colors, ...(parsed.colors || {}) },
          banner: { ...DEFAULT_SITE_CONFIG.banner, ...(parsed.banner || {}) },
          categories: Array.isArray(parsed.categories) && parsed.categories.length > 0
            ? parsed.categories
            : DEFAULT_SITE_CONFIG.categories,
        };
        return NextResponse.json(merged);
      } catch (e) {
        console.error('Failed to parse site_config JSON:', e);
      }
    }

    // Fallback check for single-key header setting
    const legacyHeader = await db.siteSetting.findUnique({
      where: { key: LEGACY_HEADER_KEY },
    });

    if (legacyHeader?.value) {
      return NextResponse.json({
        ...DEFAULT_SITE_CONFIG,
        eventTitle: legacyHeader.value,
      });
    }

    return NextResponse.json(DEFAULT_SITE_CONFIG);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(DEFAULT_SITE_CONFIG);
  }
}

export async function PUT(request: Request) {
  const auth = verifyAuth(request);
  if (!auth) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    // Sanitize and ensure core structure
    const updatedConfig: SiteConfig = {
      eventTitle: body.eventTitle?.trim() || DEFAULT_SITE_CONFIG.eventTitle,
      eventSubtitle: body.eventSubtitle !== undefined ? body.eventSubtitle : DEFAULT_SITE_CONFIG.eventSubtitle,
      eventEmoji: body.eventEmoji !== undefined ? body.eventEmoji : DEFAULT_SITE_CONFIG.eventEmoji,
      themePreset: body.themePreset || 'custom',
      colors: {
        ...DEFAULT_SITE_CONFIG.colors,
        ...(body.colors || {}),
      },
      banner: {
        ...DEFAULT_SITE_CONFIG.banner,
        ...(body.banner || {}),
      },
      categories: Array.isArray(body.categories) && body.categories.length > 0
        ? body.categories
        : DEFAULT_SITE_CONFIG.categories,
    };

    // Save site_config
    await db.siteSetting.upsert({
      where: { key: CONFIG_KEY },
      update: { value: JSON.stringify(updatedConfig) },
      create: { key: CONFIG_KEY, value: JSON.stringify(updatedConfig) },
    });

    // Synchronize standalone header_title setting for backward compatibility
    await db.siteSetting.upsert({
      where: { key: LEGACY_HEADER_KEY },
      update: { value: updatedConfig.eventTitle },
      create: { key: LEGACY_HEADER_KEY, value: updatedConfig.eventTitle },
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

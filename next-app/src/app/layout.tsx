import type { Metadata } from 'next';
import './globals.css';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import DemoBanner from '@/components/DemoBanner';

export const metadata: Metadata = {
  title: '🎁 Christmas Wishlist',
  description: 'A web application for Christmas wishlists for family and friends.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-[#261E17] antialiased bg-[#F7F3E8]">
        <DemoBanner />
        <SiteConfigProvider>
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  );
}

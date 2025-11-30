import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider"
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Octo',
  description: 'EVM-Compatible Wallet for Celo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐙</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=onest@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`} style={{ fontFamily: 'Onest, var(--font-inter), system-ui, sans-serif' }}>
        <ThemeProvider defaultTheme="system" storageKey="octo-ui-theme">
          {/* Navbar is included on all pages */}
          <div className="relative flex min-h-screen flex-col">
            <WalletProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </WalletProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

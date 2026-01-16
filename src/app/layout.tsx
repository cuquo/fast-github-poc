import '@/css/globals.css';

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import Header from '@/components/header';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((m) => m.Analytics),
  { ssr: false }
);

export const metadata: Metadata = {
  description: 'a github clone with NextJS 16 and cache components',
  title: 'Without the blue bar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="h-full min-h-screen w-full bg-bg-default">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}

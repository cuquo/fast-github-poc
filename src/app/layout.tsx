import '@/css/globals.css';

import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import Header from '@/components/header';

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

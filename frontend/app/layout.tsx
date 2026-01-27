import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/shared';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LG VS MTK Dashboard',
  description: 'LG Electronics Vehicle Solution - Technology Review Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Sidebar />
        <main className="lg:ml-72 min-h-screen bg-slate-50">{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import AuthProvider from '../components/AuthProvider';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Clubs Scrapper',
  description: 'Football clubs data explorer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${
          geistSans.variable
        } ${geistMono.variable} bg-white dark:bg-gray-900 min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

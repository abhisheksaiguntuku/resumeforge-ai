import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'ResumeForge AI - Build Your Perfect Resume',
  description: 'AI-powered resume builder and optimizer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#0a0a0f] text-white">
        {children}
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#12121a',
            color: '#fff',
            border: '1px solid #2a2a3a',
          }
        }} />
      </body>
    </html>
  );
}

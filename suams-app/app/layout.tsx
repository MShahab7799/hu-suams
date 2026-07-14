import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import FloatingChatbot from '@/components/chatbot/FloatingChatbot';

export const metadata: Metadata = {
  title: {
    default: 'Smart Appointment System — Hazara University Mansehra',
    template: '%s | Hazara University SUAMS',
  },
  description:
    'Book appointments online with Vice Chancellor, Registrar, Deans, Chairmen, HODs and other university officials of Hazara University through one secure digital platform.',
  keywords: [
    'Hazara University', 'appointment', 'booking', 'Vice Chancellor',
    'Registrar', 'Mansehra', 'KPK', 'Pakistan', 'university',
  ],
  authors: [{ name: 'Hazara University IT Department' }],
  robots: { index: false, follow: false },
  openGraph: {
    title: 'HU Smart Appointment System',
    description: 'Book appointments with Hazara University officials online.',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport: Viewport = {
  themeColor: '#1B4D3E',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>
          {children}
          <FloatingChatbot />
        </Providers>
      </body>
    </html>
  );
}

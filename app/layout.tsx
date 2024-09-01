import './styles/globals.css';
import type { Metadata } from 'next';
import { Varela } from 'next/font/google';
import ReduxProvider from '@/app/ReduxProvider';

const varela = Varela({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
  title: 'Personal Activity Randomizer',
  description: 'An application for systematization and random selection of your leisure activities.',
  keywords: 'activity, randomizer, leisure, hobbies, productivity',
  openGraph: {
    title: 'Personal Activity Randomizer',
    description: 'An application for systematization and random selection of your leisure activities.',
    url: 'https://personal-activity-randomizer.vercel.app/',
    siteName: 'Personal Activity Randomizer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://personal-activity-randomizer.vercel.app/par-icon.png',
        width: 212,
        height: 196,
        alt: 'Personal Activity Randomizer',
      },
    ],
  },
  metadataBase: new URL('https://personal-activity-randomizer.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="5864oEfDjbwquDIWNfzF-_Dg44SmKJPuPajI2TEFepI" />
      </head>
      <body className={varela.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

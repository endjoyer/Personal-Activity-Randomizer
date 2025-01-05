import './styles/globals.css';
import type { Metadata } from 'next';
import { Varela } from 'next/font/google';
import ReduxProvider from '@/app/ReduxProvider';

const varela = Varela({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
  title: 'Personal Activity Randomizer',
  description:
    'An application for systematization and random selection of your leisure activities.',
  applicationName: 'PAR',
  generator: 'Personal Activity Randomizer',
  creator: 'Abamzarov Aleksey',
  keywords: 'activity, randomizer, leisure, hobbies, productivity',
  icons: {
    icon: '/images/par-icon.png',
    shortcut: '/images/par-icon.png',
    other: {
      rel: 'par-icon',
      url: '/images/par-icon.png',
    },
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
  },
  category: 'technology',
  openGraph: {
    title: 'Personal Activity Randomizer',
    description:
      'An application for systematization and random selection of your leisure activities.',
    url: 'https://personal-activity-randomizer.vercel.app/',
    siteName: 'Personal Activity Randomizer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://personal-activity-randomizer.vercel.app/images/par-icon.png',
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
        <meta
          name="google-site-verification"
          content="5864oEfDjbwquDIWNfzF-_Dg44SmKJPuPajI2TEFepI"
        />
      </head>
      <body className={varela.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

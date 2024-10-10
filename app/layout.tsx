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
        <meta name="yandex-verification" content="8647483e900cbfa7" />
        <meta name="description" content="An application for systematization and random selection of your leisure activities." />
        <meta name="keywords" content="activity, randomizer, leisure, hobbies, productivity, активность, рандомайзер, досуг, хобби, продуктивность" />
        <meta name="author" content="Abamzarov Aleksey" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/par-icon.png" />
      </head>
      <body className={varela.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

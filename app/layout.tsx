import './styles/globals.css';
import type { Metadata } from 'next';
import { Alegreya } from 'next/font/google';
import ReduxProvider from '@/app/ReduxProvider';

const alegreya = Alegreya({ subsets: ['latin'], weight: ['500'] });

export const metadata: Metadata = {
  title: 'Personal Activity Randomizer',
  description: 'An application for systematization and random selection of your leisure activities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={alegreya.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

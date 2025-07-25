import './globals.css';
import { Header } from '@components/Header';
import { BlockbusterDataProvider } from '@components/BlockbusterIndex/BlockbusterDataProvider';

export const metadata = {
  alternates: {
    canonical: 'https://www.blockbusterindex.com',
  },
  description:
    'A look at how U.S. consumers have shifted from brick-and-mortar stores to e-commerce marketplaces, inspired by the nostalgic fall of brick-and-mortar video rental shops.',
  metadataBase: new URL('https://www.blockbusterindex.com'),
  openGraph: {
    description: 'Millennial Nostalgia. Retail Signals. AI Vibes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blockbuster Index',
      },
    ],
    siteName: 'Blockbuster Index',
    title: 'Blockbuster Index',
    url: 'https://www.blockbusterindex.com',
    type: 'website',
  },
  title: 'Blockbuster Index',
  twitter: {
    card: 'summary_large_image',
    title: 'Blockbuster Index',
    description: 'Millennial Nostalgia. Retail Signals. AI Vibes.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BlockbusterDataProvider>
          <Header />
          {children}
        </BlockbusterDataProvider>
      </body>
    </html>
  );
}

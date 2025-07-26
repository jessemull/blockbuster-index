import './globals.css';
import Script from 'next/script';
import { BlockbusterDataProvider } from '@components/BlockbusterIndex/BlockbusterDataProvider';
import { Header } from '@components/Header';
import VHSBot from '@components/VHSBot';

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
    images: ['/og-image.png'],
  },
};

const NEXT_PUBLIC_GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link rel="canonical" href="https://www.blockbusterindex.com/" />
        <meta
          name="description"
          content="Millennial Nostalgia. Retail Signals. AI Vibes."
        />
        <meta property="og:title" content="Blockbuster Index" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body>
        <Header />
        <BlockbusterDataProvider>{children}</BlockbusterDataProvider>
        <VHSBot />
        <>
          <Script id="gtag-load" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              (window.requestIdleCallback || function(cb) { setTimeout(cb, 0); })(() => {
                const script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_TRACKING_ID}';
                script.async = true;
                document.head.appendChild(script);

                gtag('js', new Date());
                gtag('config', '${NEXT_PUBLIC_GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              });
            `}
          </Script>
        </>
      </body>
    </html>
  );
};

export default RootLayout;

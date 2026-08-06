'use client';

import * as Sentry from '@sentry/nextjs';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
}

const GlobalError: React.FC<Props> = ({ error }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-center">
        <div className="flex flex-col items-center max-w-xl w-full">
          <div className="text-black mb-6 flex justify-center">
            <Clapperboard
              className="w-[20vw] h-[20vw] max-w-[160px] max-h-[160px]"
              stroke="#CD1C18"
              strokeWidth="1"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-black mb-4">
            Something Went Wrong!
          </h1>
          <p className="text-md md:text-lg font-bold text-black mb-6">
            We’ve logged the issue. Please refresh to try again.
          </p>
          <Link
            className="text-gray-900 text-2xl hover:underline transition-colors"
            href="/"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;

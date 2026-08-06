'use client';

import dynamic from 'next/dynamic';

const VHSBot = dynamic(() => import('@components/VHSBot'), {
  ssr: false,
});

export default function LazyVHSBot() {
  return <VHSBot />;
}

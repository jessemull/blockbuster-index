import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  output: 'export',
  productionBrowserSourceMaps: process.env.ENABLE_SOURCE_MAPS === 'true',
  images: {
    unoptimized: true,
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ENABLE_ANALYZER === 'true',
});

export default withSentryConfig(withAnalyzer(baseConfig), {
  org: '100-letters-project',
  project: 'blockbuster-index-client',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { disable: process.env.ENABLE_SOURCE_MAPS !== 'true' },
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});

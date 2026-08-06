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
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
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

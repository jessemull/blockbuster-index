const { execFileSync, execSync } = require('child_process');

let path = '.env.local';

switch (process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT) {
  case 'production':
    path = '.env.production';
    break;
  case 'test':
    path = '.env.test';
    break;
  default:
    path = '.env.local';
    break;
}

require('dotenv').config({ path });

(async () => {
  const env = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

  const { SENTRY_AUTH_TOKEN_SOURCE_MAPS, SENTRY_ORG, SENTRY_PROJECT } =
    process.env;

  if (!SENTRY_AUTH_TOKEN_SOURCE_MAPS || !SENTRY_ORG || !SENTRY_PROJECT) {
    const message =
      'Sentry upload skipped due to missing environment variables...';
    if (process.env.CI) {
      console.error(message);
      process.exit(1);
    }
    console.warn(message);
    return;
  }

  const commitHash = execSync('git rev-parse HEAD').toString().trim();
  const release = `${env}-${commitHash}`;

  console.log(
    `Uploading source maps for release ${release} in ${env} environment...`,
  );

  const sentryEnv = {
    ...process.env,
    SENTRY_AUTH_TOKEN: SENTRY_AUTH_TOKEN_SOURCE_MAPS,
  };

  const runSentryCli = (args) => {
    execFileSync('npx', ['sentry-cli', ...args], {
      stdio: 'inherit',
      env: sentryEnv,
    });
  };

  try {
    runSentryCli([
      'releases',
      '--org',
      SENTRY_ORG,
      '--project',
      SENTRY_PROJECT,
      'new',
      release,
    ]);
    runSentryCli([
      'releases',
      '--org',
      SENTRY_ORG,
      '--project',
      SENTRY_PROJECT,
      'files',
      release,
      'upload-sourcemaps',
      '.next',
      '--url-prefix',
      '~/_next',
      '--validate',
      '--ignore-file',
      '.sentryignore',
    ]);
    runSentryCli([
      'releases',
      '--org',
      SENTRY_ORG,
      '--project',
      SENTRY_PROJECT,
      'finalize',
      release,
    ]);
    runSentryCli([
      'releases',
      '--org',
      SENTRY_ORG,
      '--project',
      SENTRY_PROJECT,
      'deploys',
      release,
      'new',
      '--env',
      env,
    ]);

    console.log('Sentry source maps uploaded.');
  } catch (err) {
    console.error(
      'Sentry source map upload failed: ',
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  }
})();

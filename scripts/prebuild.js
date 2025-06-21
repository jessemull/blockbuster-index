require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.test',
});

const noRefresh = process.argv.includes('--no-refresh');

if (noRefresh) {
  process.exit(0);
} else {
  console.log('Fetching latest blockbuster index data...');
  authenticateUser();
}

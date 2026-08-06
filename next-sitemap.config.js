// siteUrl is always the production canonical host. Test/dev builds may copy
// these sitemap files into out/, but SEO discovery targets production.
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.blockbusterindex.com',
  generateRobotsTxt: true,
};

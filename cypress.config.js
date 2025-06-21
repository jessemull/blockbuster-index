// Proxy server with signed cookie for accessing https://www.dev.blockbusterindex.com at http://localhost:8080...

module.exports = {
  e2e: {
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://www.blockbusterindex.com'
        : 'http://localhost:8080',
    supportFile: false,
  },
};

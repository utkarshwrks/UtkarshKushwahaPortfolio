/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://utkarsh-kushwaha.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 7000,

  // explicitly provide all app routes here
additionalPaths: async (config) => [
  await config.transform(config, '/'),
  await config.transform(config, '/about'),
  await config.transform(config, '/projects'),
  await config.transform(config, '/contact'),
  await config.transform(config, '/experience'),
]

}

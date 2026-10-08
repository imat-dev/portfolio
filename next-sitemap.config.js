/**
 * Sitemap is generated via the next-sitemap plugin. For more options see:
 * https://www.npmjs.com/package/next-sitemap
 */

module.exports = {
  // VERCEL_* system variables are bare hostnames (no protocol); a URL without
  // https:// makes the RSS feed (feed 6) throw 'Invalid URL' and fails the build.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000',
  generateRobotsTxt: true,
  // ...other options
}

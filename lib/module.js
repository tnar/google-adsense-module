const { resolve } = require('path')
const consola = require('consola')
const logger = consola.withTag('nuxt-adsense-module')
// Default for adslots (defaults to test mode)
const DEFAULTS = {
  tag: 'adsbygoogle',
  id: null,
  pageLevelAds: false,
  includeQuery: false,
  analyticsUacct: '',
  analyticsDomainName: '',
  test: false,
  shouldRandomizeAdRegion: false
}

// Default client ID for testing
const TEST_ID = 'ca-google'

// Adsense script URL
const ADSENSE_URL = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

module.exports = function nuxtAdSense (moduleOptions = {}) {
  const rawOptions = { ...DEFAULTS, ...this.options['google-adsense'], ...moduleOptions }

  const options = normalizeOptions(rawOptions)

  const isDevMode = this.options.dev || process.env.NODE_ENV !== 'production'

  if (isDevMode) {
    // If in DEV mode, place ads in 'test' state automatically
    // https://www.thedev.blog/3087/test-adsense-ads-safely-without-violating-adsense-tos/
    options.test = true
  }

  if (options.test) {
    options.id = TEST_ID
  }

  const isAdsenseIdInvalid = !options.id || typeof options.id !== 'string'

  if (isAdsenseIdInvalid) {
    logger.warn('Invalid adsense client ID specified.')
    return
  }

  // Set the desired component tag name
  options.tag = options.tag || DEFAULTS.tag

  // Register our plugin and pass config options
  this.addPlugin({
    src: resolve(__dirname, './plugin.template.js'),
    fileName: 'adsbygoogle.js',
    options
  })

  // Add the async Google AdSense script to head
  this.options.head.script.push({
    async: true,
    src: ADSENSE_URL
  })

  // Unfortunately these lines are needed to prevent vue-meta from escaping quotes in the init script
  this.options.head.__dangerouslyDisableSanitizers = this.options.head.__dangerouslyDisableSanitizers || []
  this.options.head.__dangerouslyDisableSanitizers.push('script')

  // Initialize Adsense with ad client id
  this.options.head.script.push({
    innerHTML: `
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "${options.id}",
        enable_page_level_ads: ${options.pageLevelAds ? 'true' : 'false'}
      });
  `
  })

  if (options.test) {
    // If in test mode, add robots meta first to comply with Adsense policies
    // To prevent MediaPartenrs from scraping the site
    this.options.head.meta.unshift({
      name: 'robots',
      content: 'noindex,noarchive,nofollow'
    })
  }
}

function normalizeOptions (options) {
  options.test = Boolean(options.test)
  options.pageLevelAds = Boolean(options.pageLevelAds)
  options.includeQuery = String(Boolean(options.includeQuery))
  options.analyticsUacct = options.analyticsUacct || ''
  options.analyticsDomainName = options.analyticsDomainName || ''
}

module.exports.meta = require('./../package.json')

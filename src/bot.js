const { Cluster } = require('puppeteer-cluster')
const { debug } = require('./util')

class Bot extends Map {
  constructor(app) {
    super()
    this.app = app
  }
  hasAny() {
    return Boolean(this.size)
  }
  first() {
    if (this.hasAny()) {
      return this.entries().next().value
    }
  }
  async build(config) {
    if (this._running) {
      return this._running
    }

    config = {
      // concurrency: Cluster.CONCURRENCY_CONTEXT,
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: this.app.config.maxConcurrency || os.cpus().length,
      retryLimit: this.app.config.retryLimit,
      retryDelay: this.app.config.retryDelay,
      timeout: this.app.config.defaultTimeout,
      puppeteerOptions: {
        devtools: this.app.config.headless ? false : true,
        ignoreHTTPSErrors: true,
        timeout: this.app.config.defaultTimeout,
        args: [
          '--ignore-certificate-errors',
          '--no-first-run',
          '--window-position=0,0',
          '--ignore-certificate-errors-spki-list',

          '--disable-background-timer-throttling',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-cloud-import',
          '--disable-default-apps',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-gesture-typing',
          '--disable-hang-monitor',
          '--disable-infobars',
          '--disable-notifications',
          '--disable-offer-store-unmasked-wallet-cards',
          '--disable-offer-upload-credit-cards',
          '--disable-popup-blocking',
          '--disable-print-preview',
          '--disable-prompt-on-repost',
          '--disable-setuid-sandbox',
          '--disable-speech-api',
          '--disable-sync',
          '--disable-tab-for-desktop-share',
          '--disable-translate',
          '--disable-voice-input',
          '--disable-wake-on-wifi',
          '--enable-async-dns',
          '--enable-simple-cache-backend',
          '--enable-tcp-fast-open',
          '--enable-webgl',
          '--hide-scrollbars',
          '--ignore-gpu-blacklist',
          '--media-cache-size=33554432',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-first-run',
          '--no-pings',
          '--no-sandbox',
          '--no-zygote',
          '--password-store=basic',
          '--prerender-from-omnibox=disabled',
          '--use-gl=swiftshader',
          '--use-mock-keychain',
        ]
      },
      ...config
    }

    // if (!config.puppeteerOptions.devtools) {
    //   config.puppeteerOptions.args.push('--single-process')
    // }

    const cluster = await Cluster.launch(config)

    cluster.on('taskerror', (err, data) => {
      debug(`Error crawling ${data}: ${err.message}`);
    })

    this._running = cluster

    return cluster
  }
  async buildOrFirst(config) {
    const first = this.first()

    if (!first) {
      return this.build(config)
    }

    return first
  }
}

module.exports = Bot
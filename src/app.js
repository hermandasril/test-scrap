const os = require('os')
const nodePath = require('path')
const Bot = require('./bot')
let ON_DEATH = require('death')
const Scraper = require('./scraper/index')


class AppConfig {
  constructor(config) {
    this.vendor = config.vendor
    this.mode = config.mode
    this.basePath = config.basePath
    this.debug = config.debug
    this.debugVerbose = config.verbose
    this.maxConcurrency = config.maxConcurrency || os.cpus().length
    this.defaultTimeout = config.timeout || 60000
    this.crawlingSpeed = config.speed || 'normal'
    this.retryLimit = config.retryLimit || 5
    this.retryDelay = config.retryDelay || 0
    this.headless = typeof config.headless === 'undefined' ? true : Boolean(config.headless)
    this.scrapingPageUrl = config.pageUrl
  }
}

class AppPath {
  constructor(basePath) {
    this.basePath = basePath
  }
  result(...p) {
    return nodePath.join(this.basePath, 'result', ...p)
  }
  relativeResult(...p) {
    return nodePath.join('result', ...p)
  }
}

class App {
  constructor(config, path) {
    this.config = config
    this.path = path

    if (this.config.debug) {
      global.IS_DEBUG_MODE = true

      if (this.config.debugVerbose) {
        global.IS_VERBOSE_MODE = true
      }

      ON_DEATH = ON_DEATH({
        uncaughtException: true,
        debug: true
      })
    } else {
      ON_DEATH = ON_DEATH({
        uncaughtException: true
      })
    }

    this.bot = new Bot(this)
  }
  async crawl(mode) {
    let crawler
    let timeout = 60

    if (mode === 'collection') {
      crawler = new Scraper.Collection(this)
      timeout = 24 * 60
    } else if (mode === 'page') {
      crawler = new Scraper.Page(this)
      timeout = 16 * 60
    }

    await crawler.crawl()

    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      })
    }, timeout * 1000 * 60)
  }
}

module.exports = {
  App,
  AppConfig,
  AppPath
}

#!/usr/bin/env node
'use strict';
const meow = require('meow');
const scraper = require('./src');
const path = require('path')

const cli = meow(`
  Usage
    $ scraprop (mode) (vendor) [url]

  Options
    --output  Directory to save downloaded manga based on cwd [Default: result]
    --config  Path to config file [Default: config.js]
    --headless  Use headless mode [Default: true]
    --speed  Crawling speed. Choose between slow, normal, fast. [Default: normal]
    --debug  Run debug mode [Default: false]
    --verbose Run debug in verbose mode

  Examples
    $ scraprop collection rumah123
    Scrape all episodes of given manga
    $ scraprop page lamudi https://www.lamudi.co.id/cluster-galea-at-segara-city-tipe-calcea.html
    ponies & rainbows
`, {
  flags: {
    output: {
      type: 'string',
      default: 'result'
    },
    headless: {
      type: 'boolean',
      default: true
    },
    watermark: {
      type: 'string'
    },
    speed: {
      type: 'string',
      default: 'normal'
    },
    debug: {
      type: 'boolean'
    },
    verbose: {
      type: 'boolean'
    },
    config: {
        type: 'string',
        default: 'config.js'
    }
  },
  booleanDefault: null
})

if (['collection', 'page'].indexOf(cli.input[0]) === -1) {
  console.log(`Please specify mode to execute. Use help: "scraprop --help" to view available commands`)
  process.exit()
}

if (['lamudi', 'rumah123', '99co', 'ninety-nine'].indexOf(cli.input[1]) === -1) {
    console.log(`Please specify vendor to execute. Use help: "scraprop --help" to view available commands`)
    process.exit()
}

if (cli.input[0] === 'page' && !cli.input[2]) {
    console.log(`Please specify url to execute. Use help: "scraprop --help" to view available commands`)
    process.exit()
}

let conf = {
  vendor: cli.input[1],
  mode: cli.input[0],
  pageUrl: cli.input[0] === 'page' ? cli.input[2] : null,
  outputDir: path.join(process.cwd(), cli.flags.output),
  outputDirName: cli.flags.output,
  headless: cli.flags.headless,
  debug: typeof cli.flags.debug === 'boolean' ? cli.flags.debug : false,
  verbose: typeof cli.flags.verbose === 'boolean' ? cli.flags.verbose : false,
  maxConcurrency: cli.flags.worker ? parseInt(cli.flags.worker, 10) : null,
  speed: cli.flags.speed,
  basePath: process.cwd(),
}

if (cli.flags.config) {
  conf = Object.assign(conf, require(path.join(process.cwd(), cli.flags.config)))
}

async function run() {
  try {
    await scraper(conf)
  } catch (err) {
    console.log('Applicatin Error: ', err)
  }

  setTimeout(() => {
    process.exit(1)
  }, 100)
}

run()

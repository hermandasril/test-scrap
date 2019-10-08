const Rumah123 = require('./rumah123')
const Lamudi = require('./lamudi')
const NinetyNine = require('./ninety-nine')

class Collection {
    constructor(app) {
        this.app = app
    }
    async crawl() {
        const vendor = this.app.config.vendor
        let scraper

        if (vendor === 'rumah123') {
            scraper = new Rumah123()
        } else if (vendor === 'lamudi') {
            scraper = new Lamudi()
        } else if (vendor === '99co' || vendor === 'ninety-nine') {
            scraper = new NinetyNine()
        }

        scraper.setCollection(this)

        await scraper.crawlCollection()
    }
}

class Page {
    constructor(app) {
        this.app = app
    }
    async crawl() {
        const vendor = this.app.config.vendor
        let scraper

        if (vendor === 'rumah123') {
            scraper = new Rumah123()
        } else if (vendor === 'lamudi') {
            scraper = new Lamudi()
        } else if (vendor === '99co') {
            scraper = new NinetyNine()
        }

        scraper.setPage(this)

        await scraper.crawlPage()
    }
}

module.exports = {
    Collection,
    Page
}
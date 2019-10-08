const { debug, debugVerbose, delay } = require('../util')
const nodeFs = require('fs')

class Rumah123 {
    constructor() {
        this.collectionUrl = `https://www.rumah123.com/jual/residensial/`
        this.collection = null
        this.page = null
        this.app = null
    }
    setCollection(collection) {
        this.collection = collection
        this.app = collection.app
    }
    setPage(page) {
        this.page = page
        this.app = page.app
    }
    async crawlCollection() {
        this.bot = await this.app.bot.build()

        await delay(2000)
    
        this.bot.task(async ({ page, data }) => {
            debugVerbose(`Navigating to ${data.url} with timeout ${this.app.config.defaultTimeout}`)
    
            await page.goto(data.url, {
                waitUntil: ['domcontentloaded'],
                timeout: this.app.config.defaultTimeout
            })
            const hrefs = []

            document.querySelectorAll('.listing-list > li').forEach(li => {
                hrefs.push(li.querySelector('h2 > a').href)
            })

            let currentPage = document.querySelector('.ant-pagination-item.ant-pagination-item-active').getAttribute('title')
            currentPage = parseInt(currentPage, 10)

            // if (currentPage < 3) {
            //     this.bot.queue({ url:  })
            // }

        })

        await this.bot.queue({ url: this.collectionUrl })
    
        await this.bot.idle()
        await this.bot.close()        
    }
    async crawlPage() {
        this.bot = await this.app.bot.build()

        await delay(2000)
    
        this.bot.task(async ({ page, data }) => {
            await delay(1000)
    
            debugVerbose(`Navigating to ${data.url} with timeout ${this.app.config.defaultTimeout}`)
    
            await page.goto(data.url, {
                waitUntil: ['domcontentloaded'],
                timeout: this.app.config.defaultTimeout
            })

            const initialState = await page.evaluate(() => {
                return window.__INITIAL_STATE__
            })
            
            nodeFs.writeFileSync(this.app.path.result('rumah123test2nd.json'), JSON.stringify(initialState, null, 2))
        })
    
        await this.bot.queue({ url: this.app.config.scrapingPageUrl })
    
        await this.bot.idle()
        await this.bot.close()
      
    }
}

module.exports = Rumah123
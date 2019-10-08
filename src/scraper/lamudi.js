const { debug, debugVerbose, delay } = require('../util')
const nodeFs = require('fs')

class Lamudi {
    constructor() {
        this.collectionUrl = `https://www.lamudi.co.id/buy/`
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

            let result = await page.evaluate(() => {
                var title = document.querySelector('h1').textContent.trim()
                var link = window.location.href
                var description = document.querySelector('.ViewMore-text-description').innerHTML.trim()
                var images = []

                document.querySelectorAll('#js-viewerContainerGallerySwiper img').forEach(v => {
                    images.push(v.dataset.src)
                })

                var data = {
                    title,
                    link,
                    description,
                    ...window.dataLayer[0],
                    images
                }

                return data
            })

            
            nodeFs.writeFileSync(this.app.path.result('Lamuditest2nd.json'), JSON.stringify(result, null, 2))
        })
    
        await this.bot.queue({ url: this.app.config.scrapingPageUrl })
    
        await this.bot.idle()
        await this.bot.close()
      
    }
}

module.exports = Lamudi
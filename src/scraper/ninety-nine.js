const { debug, debugVerbose, delay } = require('../util')
const nodeFs = require('fs')

class NinetyNine {
    constructor() {
        this.collectionUrl = `https://www.99.co/id/jual`
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
                var title = document.title.trim()
                var link = window.location.href
                var description = document.querySelector('.property-secondary__desc .expand-desc__value').innerHTML.trim()
                var images = []
                var price = document.querySelector('.property-secondary-heading__price h2').textContent.trim()
                var property_type
                var bedroom_total
                var bathroom_total
                var district
                var village = document.querySelector('.p-street-address.type-additionalRegion').innerText.trim()
                var city
                var province
                var voltage
                var floors_total
                var poster = document.querySelector('.property-secondary__agent__account h2').innerText.trim()

                document.querySelectorAll('.galery-component img').forEach(v => {
                    images.push(v.src)
                })

                document.querySelectorAll('.property-secondary__detail .property-secondary__detail__column').forEach(col => {
                    var key = col.querySelector('.property-secondary__detail__key').innerText.trim()
                    var lowKey = key.toLowerCase()
                    var value = col.querySelector('.property-secondary__detail__value').innerText.trim()

                    if (lowKey === 'tipe property') {
                        property_type = value
                    } else if (lowKey === 'kamar mandi') {
                        bathroom_total = parseInt(value, 10)
                    } else if (lowKey === 'kamar tidur') {
                        bedroom_total = parseInt(value, 10)
                    } else if (lowKey === 'daya listrik') {
                        voltage = value
                    } else if (lowKey === 'jumlah lantai') {
                        floors_total = parseInt(value, 10)
                    }
                })

                var data = {
                    title,
                    link,
                    description,
                    images,
                    price,
                    property_type,
                    bedroom_total,
                    bathroom_total,
                    district,
                    village,
                    city,
                    province,
                    voltage,
                    floors_total,
                    poster
                }

                return data
            })

            
            nodeFs.writeFileSync(this.app.path.result('NinetyNinetest2nd.json'), JSON.stringify(result, null, 2))
        })
    
        await this.bot.queue({ url: this.app.config.scrapingPageUrl })
    
        await this.bot.idle()
        await this.bot.close()
      
    }
}

module.exports = NinetyNine
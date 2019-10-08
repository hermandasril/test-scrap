const { App, AppConfig, AppPath } = require('./app')
const fs = require('fs')

module.exports = async (config) => {
  const appConfig = new AppConfig(config)
  const appPath = new AppPath(appConfig.basePath)
  const app = new App(appConfig, appPath)

  if (!fs.existsSync(appPath.result())) {
    fs.mkdirSync(appPath.result(), { recursive: true })
  }

  return app.crawl(config.mode)
}

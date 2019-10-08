const dayjs = require('dayjs')

const Util = module.exports = {}

Util.debug = (...arg) => {
    if (global.IS_DEBUG_MODE) {
      console.log(...arg)
    }
}
  
Util.debugVerbose = (...arg) => {
    if (global.IS_DEBUG_MODE && global.IS_VERBOSE_MODE) {
        console.log(...arg)
    }
}

Util.dayjs = dayjs

Util.isDateValid = (d) => {
    return d instanceof Date && !isNaN(d)
}

Util.delay = async (timeout) => new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeout || 1)
})

Util.isPlainObject = require('is-plain-object')

Util.parseDate = (value) => {
    if (value instanceof Date && !isNaN(value)) {
      return value
    } else {
        let d = Util.dayjs.unix(value)

        if (d.isValid()) {
            return d.toDate()
        }
    }
}
  
Util.serializeValue = (value) => {
    if (value) {
      if (typeof value.toJson === 'function') {
        value = Util.serializeValue(value.toJson())
      } else if (value instanceof Map) {
        let res = []
        for (let val of value.values()) {
          res.push(Util.serializeValue(val))
        }
  
        value = res
      } else if (Util.isPlainObject(value)) {
        for (const key in value) {
          if (key === 'created_at' || key === 'updated_at') {
            value[key] = Util.parseDate(value[key])
          } else {
            value[key] = Util.serializeValue(value[key])
          }
        }
      } else if (Array.isArray(value)) {
        value = value.map(Util.serializeValue)
      }
    }
  
    return value
}
  
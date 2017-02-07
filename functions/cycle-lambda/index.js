const Cycle = require('@cycle/xstream-run')
const xs = require('xstream').default
const main = require('./lib/main')

exports.handler = function handler (event, context, callback) {
  const drivers = {
    Lambda: result$ => {
      result$.addListener({
        next: result => {
          callback(null, result)
        },
        error: callback
      })

      return {
        Event: xs.of(event).remember(),
        Context: xs.of(context).remember()
      }
    }
  }
  Cycle.run(main, drivers)
}

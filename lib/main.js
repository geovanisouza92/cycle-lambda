module.exports = function main (sources) {
  const sinks = {
    Lambda: sources.Lambda.Event
      .mapTo('hello world')
  }
  return sinks
}

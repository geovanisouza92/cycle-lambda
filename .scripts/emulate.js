#!/usr/bin/env node

require('dotenv').config()

const path = require('path')

test(process.argv.slice(2)[0])

function test (functionName) {
  const lambda = require(`../functions/${functionName}`)
  const config = require(path.resolve(`functions/${functionName}/config.json`))

  lambda.handler(config.testEvent, null, callback)
}

function callback (err, result) {
  if (err) {
    return console.error(err)
  }

  console.log(result)
}

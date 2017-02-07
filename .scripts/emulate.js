#!/usr/bin/env node

require('dotenv').config()

const cycleLambda = require('../functions/cycle-lambda')

test()

function test () {
  const event = {}

  cycleLambda.handler(event, null, callback)
}

function callback (err, result) {
  if (err) {
    return console.error(err)
  }

  console.log(result)
}

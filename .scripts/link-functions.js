#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const libPath = path.resolve('./lib')

fs.readdirSync('functions').forEach(function (fn) {
  if (fn.startsWith('.')) {
    return
  }

  const config = require(path.resolve('functions', fn, 'config.json'))
  if (!config.includeLib) {
    return
  }

  const libDest = path.resolve('functions', fn, 'lib')
  try {
    if (fs.statSync(libDest)) {
      return
    }
  } catch (e) {
  }

  console.log('Linking lib to', fn)
  fs.symlinkSync(libPath, libDest)
})

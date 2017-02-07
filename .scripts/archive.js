#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const cp = require('child_process')

module.exports = function archive (functionName, env, includeLib) {
  const base = process.cwd()
  return new Promise(function (resolve, reject) {
    try {
      const tmp = path.join(base, '.tmp', functionName)
      const zipFilename = path.join(base, `${functionName}-${env}.zip`)

      try {
        fs.statSync(zipFilename)
        fs.unlinkSync(zipFilename)
      } catch (_) {}

      fs.mkdirsSync(tmp)
      fs.copySync(path.join(base, 'functions', functionName, 'index.js'), path.join(tmp, 'index.js'))
      if (includeLib) {
        fs.copySync(path.join(base, 'package.json'), path.join(tmp, 'package.json'))
        fs.copySync(path.join(base, 'lib'), path.join(tmp, 'lib'))
      }
      process.chdir(tmp)
      cp.spawnSync('npm', ['install', '--production'])
      cp.spawnSync('zip', ['-u', '-r', zipFilename, '.'])
      process.chdir(base)
      resolve(zipFilename)
    } catch (e) {
      reject(e)
    }
  })
}

#!/usr/bin/env node

require('dotenv').config()

const fs = require('fs-extra')
const path = require('path')
const aws = require('aws-sdk')
const archive = require('./archive')

const env = process.env.NODE_ENV || 'staging'
const functionName = process.env.FUNCTION_NAME
const config = require(path.resolve(process.cwd(), 'functions', functionName, 'config.json'))

const awsOptions = {
  region: process.env.REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

deploy()

function deploy () {
  console.log('Publishing started')

  const packageName = `${config.name}-${env}.zip`

  return archive(config.name, env, config.includeLib)
    .then(() => _readFile(packageName))
    .then(content => _upload(config.bucket, packageName, content))
    .then(() => _publish(config.envs[env].functionName, config.bucket, packageName))
    .then(() => console.log('Function published'))
    .catch(console.error)
}

function _readFile (filename) {
  return new Promise(function (resolve, reject) {
    console.log('Reading function package')

    fs.readFile(filename, function (err, content) {
      if (err) {
        return reject(err)
      }

      resolve(content)
    })
  })
}

function _upload (Bucket, Key, Body) {
  return new Promise(function (resolve, reject) {
    console.log('Sending function package')

    new aws.S3(awsOptions)
      .upload({Bucket, Key, Body}, function (err, res) {
        if (err) {
          return reject(err)
        }

        resolve(res)
      })
  })
}

function _publish (FunctionName, S3Bucket, S3Key) {
  return new Promise(function (resolve, reject) {
    console.log('Updating function')

    new aws.Lambda(awsOptions)
      .updateFunctionCode({FunctionName, S3Bucket, S3Key, Publish: true}, function (err, res) {
        if (err) {
          return reject(err)
        }

        resolve(res)
      })
  })
}

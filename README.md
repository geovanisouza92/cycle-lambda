# cycle-lambda

A tiny example about how to write a [Cycle.js](https://cycle.js.org/) app that runs inside a AWS Lambda function.

The idea is really simple: Use a driver to input Lambda event and context for the **main** function as a *source*, and use the *sink* to send back the result.

All the logic/behavior (and other side-effects like querying a RDS database or making an HTTP call) is handled inside **main** function with the help of other drivers. Note that the Lambda function must have the correct permissions on its role to execute such tasks.

# NPM Scripts

## npm test

Emulates a Lambda handler invocation.

If you want to provide a sample test event, configure it inside `functions/<function name>/config.json`.

## npm deploy

Deploys a functions as per `functions/<function name>/config.json` configurations on the target environment.

You must provide three environment variables (could be in a `.env` file): `REGION`, `AWS_ACCESS_KEY` and `AWS_SECRET_ACCESS_KEY` with permissions to put objects on S3 and update function code on Lambda.

# Helper scripts

## `.scripts/emulate.js`

Emulates a Lambda handler invocation. *It does not provide a context object for now.*

## `.scripts/deploy.js`

Deploys a function to Lambda.

## `.scripts/archive.js`

Used by `.scripts/deploy.js` to create a package with function code and `node_modules` dependencies.

## `.scripts/link-functions.js`

Used to link `lib/` code inside the function's folder, allowing emulation and packaging.

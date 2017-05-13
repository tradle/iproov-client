#!/usr/bin/env node

require('dotenv').config()
const vm = require('vm')
const repl = require('repl')
const extend = require('xtend/mutable')
const typeforce = require('typeforce')
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    apiKey: process.env.API_KEY,
    secret: process.env.SECRET_KEY
  }
})

typeforce({
  apiKey: typeforce.String,
  secret: typeforce.String
}, argv)

const client = require('./').client(argv)
const installHistory = require('./repl-history')
const server = repl.start({
  prompt: 'iProov: ',
  ignoreUndefined: true
})

verbosify(server)
installHistory({ server })
extend(server.context, client)

function verbosify (server) {
  const originalEval = server.eval
  server.eval = function (cmd, context, filename, callback) {
    originalEval.call(server, cmd, context, filename, function (err, res) {
      if (err) {
        console.error(err.stack)
        return callback(err)
      }

      callback(null, res)
    })
  }
}

// function isRecoverableError(error) {
//   if (error.name === 'SyntaxError') {
//     return /^(Unexpected end of input|Unexpected token)/.test(error.message)
//   }

//   return false
// }

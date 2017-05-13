const os = require('os')
const path = require('path')
const fs = require('fs')

/**
 * Save a repl's history
 * @param  {Object}     opts
 * @param  {REPLServer} opts.server
 * @param  {String}     opts.prompt
 * @param  {String}     [opts.path]
 */
module.exports = function installHistory ({ server }) {
  const historyPath = path.join(os.homedir(), '.iproov-nodejs-client')

  if (fs.existsSync(historyPath)) {
    fs.readFileSync(historyPath, { encoding: 'utf8' })
      .split('\n')
      .reverse()
      .filter(line => line.trim())
      .forEach(line => server.history.push(line))
  }

  server.on('exit', function () {
    fs.appendFileSync(historyPath, '\n' + server.lines.join('\n'), { encoding: 'utf8' })
  })
}

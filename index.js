const { Promise, co } = require('./utils')
const createClient = require('./client')

module.exports = {
  client: createAPI
}

function createAPI ({ apiKey, secret }) {
  const client = createClient({ apiKey, secret })
  const api = {
    validate: {
      enroll: function (opts) {
        return client['/claim/enrol/validate'](opts)
      },
      verify: function (opts) {
        return client['/claim/verify/validate'](opts)
      }
    }
  }

  return api
}


// const CLAIM_RESPONSE = {
// }

const types = require('./types')

module.exports = [
  {
    request: {
      method: 'POST',
      path: '/claim/enrol/validate',
      fields: ['apiKey', 'secret', 'userId', 'token', 'type']
    },
    response: {
      validate: types.claimValidateResponse
    }
  }
]

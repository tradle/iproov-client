
// const CLAIM_RESPONSE = {
// }

const types = require('./types')

module.exports = [
  {
    request: {
      method: 'POST',
      path: '/claim/enrol/validate',
      fields: ['apiKey', 'secret', 'userId', 'token', 'ip', 'client']
    },
    response: {
      validate: types.claimValidateResponse
    }
  },
  {
    request: {
      method: 'POST',
      path: '/claim/verify/validate',
      fields: ['apiKey', 'secret', 'userId', 'token', 'ip', 'client']
    },
    response: {
      validate: types.claimValidateResponse
    }
  }
]

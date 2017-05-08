const querystring = require('querystring')
const { Promise } = require('./utils')
const noop = () => {}
const FIELD_MAP = {
  apiKey: 'api_key',
  secret: 'secret',
  userId: 'user_id',
  token: 'token',
  type: 'type'
}

module.exports = {
  post: function post ({ client, base, path, data, validateResponse=noop }) {
    data = toIProovFields(data)
    return new Promise((resolve, reject) => {
      client.post(`${base}/${path}`, {
        data,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }, responseProcessor({ resolve, reject, validateResponse }))
    })
  },
  get: function get ({ client, base, path, data, validateResponse=noop }) {
    let qs = ''
    if (data) {
      data = toIProovFields(data)
      qs = '?' + querystring.stringify(data)
    }

    return new Promise((resolve, reject) => {
      client.get(`${base}/${path}${qs}`, responseProcessor({ resolve, reject, validateResponse }))
    })
  }
}

function toIProovFields (fields) {
  const translated = {}
  for (let field in fields) {
    if (field in FIELD_MAP) {
      translated[field] = FIELD_MAP[field]
    }
  }

  return translated
}

function toError (data, response) {
  const { error_description, error } = data
  const e = new Error(error_description || 'unknown iProov error')
  e.code = response.statusCode
  e.name = error
  return e
}

function responseProcessor ({ resolve, reject, validateResponse }) {
  return function processResponse (data, response) {
    if (response.statusCode >= 300) {
      return reject(toError(data, response))
    }

    try {
      validateResponse(data)
    } catch (err) {
      err.message = 'Invalid response format: ' + err.message
      err.body = data
      return reject(err)
    }

    resolve(data)
  }
}

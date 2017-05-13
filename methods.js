const request = require('superagent')
const querystring = require('querystring')
const { Promise, co } = require('./utils')
const noop = () => {}
const FIELD_MAP = {
  apiKey: 'api_key',
  userId: 'user_id'
}

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

const BASE_URL = 'https://secure.iproov.me/api/v2'

module.exports = {
  post: co(function* post ({ client, path, data, validateResponse=noop }) {
    data = toIProovFields(data)
    path = stripLeadingSlashes(path)
    const req = request
      .post(`${BASE_URL}/${path}`)
      .send(data)
      .set(headers)

    const result = yield sendRequest({ req, validateResponse })
    return normalizeResult(result)
  }),
  get: co(function* get ({ client, path, data, validateResponse=noop }) {
    let qs = ''
    if (data) {
      data = toIProovFields(data)
      qs = '?' + querystring.stringify(data)
    }

    path = stripLeadingSlashes(path)
    const req = request.get(`${BASE_URL}/${path}${qs}`)
    return yield sendRequest({ req, validateResponse })
  })
}

function toIProovFields (fields) {
  const translated = {}
  for (let field in fields) {
    if (field in FIELD_MAP) {
      let iProovField = FIELD_MAP[field]
      translated[iProovField] = fields[field]
    } else {
      translated[field] = fields[field]
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

// function responseProcessor ({ resolve, reject, validateResponse }) {
//   return function processResponse (data, response) {
//     if (response.statusCode >= 300) {
//       return reject(toError(data, response))
//     }

//   }
// }

function stripLeadingSlashes (str) {
  return str.replace(/^\/+/, '')
}

const sendRequest = co(function* ({ req, validateResponse=noop }) {
  let res
  try {
    res = yield req
  } catch (err) {
    if (err.response) {
      err = errorFromResponse(err.response)
    }

    throw err
  }

  const { ok, body } = res
  if (!ok) {
    throw errorFromResponse(res)
  }

  try {
    validateResponse(body)
  } catch (err) {
    err.message = 'Invalid response format: ' + err.message
    err.body = body
    throw err
  }

  return body
})

function errorFromResponse (res) {
  const { body={}, text, status } = res
  const err = new Error(text)
  err.body = body.error || body
  err.status = status
  return err
}

function normalizeResult (result) {
  if (result.frame) {
    result.frame = 'data:image/png;base64,' + result.frame
  }

  return result
}

const Client = require('node-rest-client')
// 'enrol' misspelled on purpose to match spelling in iProov docs
const ENDPOINTS = require('./endpoints')
const FIELD_TYPES = require('./types').fields
const METHOD_EXECUTORS = require('./methods')
const {
  pick,
  typeforce,
  shallowClone,
  shallowExtend
} = require('./utils')

const BASE_URL = 'https://secure.iproov.me/api/v2'

module.exports = function createIProovClient ({ apiKey, secret }) {
  const client = new Client()
  const api = {}
  ENDPOINTS.forEach(endpoint => {
    const { request, response } = endpoint
    const { path, fields } = endpoint.request
    const values = {}
    if (fields.indexOf('apiKey') !== -1) values.apiKey = apiKey
    if (fields.indexOf('secret') !== -1) values.secret = apiKey

    api[path] = createRequestExecutor(shallowExtend({
      client,
      values,
      validateResponse: response && response.validate
    }, request))
  })

  return api
}

function createRequestExecutor ({ client, method='POST', path, fields, values }) {
  method = method.toLowerCase()
  const types = pick(FIELD_TYPES, fields)
  return function (client, opts) {
    typeforce(types, opts)

    return METHOD_EXECUTORS[method]({
      base: BASE_URL,
      client,
      path,
      // take dynamic values over prefilled values
      data: shallowClone(values, opts)
    })
  }
}

// 'enrol' misspelled on purpose to match spelling in iProov docs
const ENDPOINTS = require('./endpoints')
const FIELD_TYPES = require('./types').fields
const METHOD_EXECUTORS = require('./methods')
const {
  typeforce,
  shallowClone,
  shallowExtend
} = require('./utils')

module.exports = function createIProovClient ({ apiKey, secret }) {
  const api = {}
  ENDPOINTS.forEach(endpoint => {
    const { request, response } = endpoint
    const { path, fields } = endpoint.request
    const values = {}
    if (fields.indexOf('apiKey') !== -1) values.apiKey = apiKey
    if (fields.indexOf('secret') !== -1) values.secret = secret

    api[path] = createRequestExecutor(shallowExtend({
      values,
      validateResponse: response && response.validate
    }, request))
  })

  return api
}

function createRequestExecutor ({ method='POST', path, fields, values }) {
  method = method.toLowerCase()
  const types = {}
  fields.forEach(field => {
    types[field] = FIELD_TYPES[field]
  })

  return function (opts) {
    const data = shallowClone(values, opts)
    typeforce(types, data)

    return METHOD_EXECUTORS[method]({
      path,
      // take dynamic values over prefilled values
      data
    })
  }
}

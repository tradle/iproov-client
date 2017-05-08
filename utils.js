const Promise = require('bluebird')
const co = Promise.coroutine
const pick = require('object.pick')
const debug = require('debug')(require('./package.json').name)
const typeforce = require('typeforce')
const shallowExtend = require('xtend/mutable')
const shallowClone = require('xtend')

module.exports = {
  Promise,
  co,
  pick,
  debug,
  typeforce,
  shallowExtend,
  shallowClone
}

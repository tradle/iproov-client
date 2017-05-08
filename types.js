const { typeforce } = require('./utils')
const CLAIM_TYPES = ['enrol', 'verify']
const USER_RESPONSE_STATUS = ['active', 'inactive', 'suspended']

// input format
const fields = {
  apiKey,
  secret,
  userId,
  token,
  type: claimType
}

const authTokenResponse = {
  access_token: typeforce.String,
  token_type: typeforce.String,
  expires_in: typeforce.String,
  scope: typeforce.maybe(typeforce.String)
}

const claimResponse = {
  fallback: typeforce.arrayOf(typeforce.String),
  token,
  user_id: userId,
  primary: typeforce.String,
  pod: typeforce.String,
  redirect_domain: typeforce.maybe(typeforce.String)
}

const claimValidateResponse = {
  passed: typeforce.Boolean,
  token,
  type: claimType,
  reason: typeforce.maybe(typeforce.String)
}

const enrolResponse = {
  token,
  user_id: userId,
  success: typeforce.Boolean
}

const errorResponse = {
  error: typeforce.String,
  error_description: typeforce.String
}

const invalidateClaimResponse = {
  claim_aborted: typeforce.Boolean,
  user_informed: typeforce.Boolean
}

const pushResultResponse = {
  state: typeforce.String,
  passed: typeforce.maybe(typeforce.Boolean),
  token: typeforce.maybed(typeforce.String)
}

const pushStartResponse = {
  session_key: typeforce.String
}

const userResponse = {
  user_id: userId,
  name: typeforce.String,
  status: userResponseStatus,
  suspension_date: typeforce.String,
  activation_date: typeforce.String
}

module.exports = {
  fields,
  authTokenResponse,
  claimResponse,
  claimValidateResponse,
  enrolResponse,
  errorResponse,
  invalidateClaimResponse,
  pushResultResponse,
  pushStartResponse,
  userResponse
}


function token (str) {
  return typeof str === 'string' && str.length === 64
}

function userId (str) {
  return typeof str === 'string' && str.length
}

function secret (str) {
  return typeof str === 'string' && str.length === 40
}

function apiKey (str) {
  return typeof str === 'string' && str.length === 40
}

function claimType (str) {
  return CLAIM_TYPES.indexOf(str) !== -1
}

function userResponseStatus (str) {
  return USER_RESPONSE_STATUS.indexOf(str) !== -1
}

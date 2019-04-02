import { merge } from 'lodash'
require('dotenv').config()
const env = process.env.NODE_ENV || 'dev'

const baseConfig = {
  env,
  isDev: env === 'dev',
  isCi: env === 'ci',
  isStg: env === 'stg',
  isProd: env === 'prod',
  rootUrl: process.env.ROOT_URL,
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  },
  papertrail: {
    host: 'logs6.papertrailapp.com',
    port: 36774
  }
}
console.log(env)
let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config
    break
  case 'ci':
    envConfig = require('./ci').config
    break
  case 'stg':
    envConfig = require('./stg').config
    break
  case 'prod':
    envConfig = require('./prod').config
    break
  default:
    envConfig = require('./dev').config
}

export default merge(baseConfig, envConfig)

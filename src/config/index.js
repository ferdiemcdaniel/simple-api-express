import { merge } from 'lodash'
require('dotenv').config()
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  rootUrl: process.env.ROOT_URL,
  port: 3000,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  },
  papertrail: {
    ci: {
      host: 'logs6.papertrailapp.com',
      port: 36774
    },
    prod: {
      host: 'logs5.papertrailapp.com',
      port: 22744
    }
  }
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config
    break
  case 'test':
  case 'testing':
    envConfig = require('./testing').config
    break
  default:
    envConfig = require('./dev').config
}

export default merge(baseConfig, envConfig)

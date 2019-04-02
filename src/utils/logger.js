/* eslint-disable no-console */
import config from '../config'
import winston from 'winston'
require('winston-papertrail').Papertrail // eslint-disable-line
let logger

if (config.isTest) {
  logger = {
    info: (...arg) => console.log(arg),
    debug: (...arg) => console.log(arg),
    error: (...arg) => console.error(arg)
  }
} else {
  const paperTrailConfig = config.papertrail
  var winstonPapertrail = new winston.transports.Papertrail({
    host: paperTrailConfig.host,
    port: paperTrailConfig.port,
    hostname: config.rootUrl,
    handleExceptions: false,
    colorize: true,
    logFormat: function(level, message) {
      return level + ': ' + message
    }
  })

  winstonPapertrail.on('error', function(err) {
    console.error(err)
  })

  logger = new winston.Logger({
    levels: {
      error: 0,
      warn: 1,
      auth: 2,
      debug: 3,
      info: 4
    },
    colors: {
      debug: 'blue',
      info: 'green',
      warn: 'yellow',
      error: 'red',
      auth: 'red'
    },
    transports: [winstonPapertrail]
  })

  // Non-sticky custom "program" name logging
  // One time custom "program" when logging (does not retain the program_name parameter)
  logger.property_program = (program, level, msg) => {
    if (!!logger.levels && !logger.levels.hasOwnProperty(level)) {
      // throw new Meteor.Error(`LOG_LEVEL_INVALID: ${level}`)
    }
    if (!msg || msg === '') {
      return
    }
    if (program) {
      program = `app/${program.replace(/\s+/g, '').toLowerCase()}` // convert to lowercase and remove spaces
    }
    let defString = 'default'

    winstonPapertrail.program = program || defString
    logger[level](msg)
    winstonPapertrail.program = defString // reset the program name to default
  }

  if (config.isDev || config.isTest) {
    // Enable console logs on non-PROD env
    logger.add(winston.transports.Console)
  }
}

console.log({ paperTrail: logger.transports.Papertrail })

export default logger

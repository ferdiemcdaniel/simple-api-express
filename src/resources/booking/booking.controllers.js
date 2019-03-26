import config from '../../config'
import ddpClient from '../../utils/ddp'
import logger from '../../utils/logger'

const extractReferenceNumber = req => {
  const { payload } = req.body
  let toReturn = ''
  if (payload && typeof payload === 'string') {
    const { events } = JSON.parse(payload)
    events.forEach(({ message }) => {
      if (message && typeof message === 'string') {
        let extractedJson = message.substr(
          message.indexOf('{'),
          message.indexOf('}') + 1
        )
        console.log(extractedJson)
        console.log(typeof extractedJson)
        const { reference } = JSON.parse(extractedJson)
        if (reference && typeof reference === 'string') {
          toReturn = reference
        }
      }
    })
  }
  return toReturn
}

const maskResult = status => {
  switch (status) {
    case 100:
      return Math.floor(Math.random() * (199 - 100) + 100)
    case 300:
      return Math.floor(Math.random() * (399 - 300) + 300)
    default:
      return 200
  }
}

const newBooking = (req, res) => {
  let referenceNumber = extractReferenceNumber(req)
  let auth = {
    username: config.secrets.temp.user,
    password: config.secrets.temp.pass
  }
  ddpClient(config.backend.dev, auth, referenceNumber, (error, success) => {
    let status = ''
    if (error) {
      console.log(error)
      status = maskResult(200)
      let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify({
        event: 'Validated New Booking',
        status,
        message: 'Booking NOT FOUND'
      })}`
      logger.property_program('Makati Riverside Inn', 'info', msg)
      res.status(200).json({
        reservationsresponse: {
          status
        }
      })
    } else {
      console.log(success)
      status = maskResult(success.result)
      let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify({
        event: 'Validated New Booking',
        status,
        message: 'Booking FOUND'
      })}`
      logger.property_program('Makati Riverside Inn', 'info', msg)
      res.status(200).json({
        reservationsresponse: {
          status
        }
      })
    }
  })
}

const cancelledBooking = (req, res) => {
  let referenceNumber = extractReferenceNumber(req)
  let auth = {
    username: config.secrets.temp.user,
    password: config.secrets.temp.pass
  }
  ddpClient(config.backend.ci, auth, referenceNumber, (error, success) => {
    let status = ''
    if (error) {
      status = maskResult(200)
      let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify({
        event: 'Validated Cancelled Booking',
        status,
        message: 'Booking NOT FOUND'
      })}`
      logger.property_program('Makati Riverside Inn', 'info', msg)
      res.status(200).json({
        reservationsresponse: {
          status
        }
      })
    } else {
      status = maskResult(success.result)
      let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify({
        event: 'Validated Cancelled Booking',
        status,
        message: 'Booking FOUND'
      })}`
      logger.property_program('Makati Riverside Inn', 'info', msg)
      res.status(200).json({
        reservationsresponse: {
          status
        }
      })
    }
  })
}

export default {
  newBooking,
  cancelledBooking
}

import config from '../../config'
import ddpClient from '../../utils/ddp'
import logger from '../../utils/logger'

const extractReferenceNumber = req => {
  const { payload } = req.body
  let toReturn = []
  if (payload && typeof payload === 'string') {
    const { events } = JSON.parse(payload)
    events.forEach(({ message }) => {
      if (message && typeof message === 'string') {
        let extractedJson = message.substr(
          message.indexOf('{'),
          message.indexOf('}') + 1
        )
        const { reference } = JSON.parse(extractedJson)
        if (reference && typeof reference === 'string') {
          toReturn.push(reference)
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
  let referenceNumbers = extractReferenceNumber(req)
  let auth = {
    username: config.secrets.temp.user,
    password: config.secrets.temp.pass
  }
  ddpClient(config.backend.ci, auth, referenceNumbers, (error, success) => {
    let status = ''
    if (
      error ||
      success === null ||
      success.result === undefined ||
      success.result.length === 0
    ) {
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
      let toReturn = []
      if (Array.isArray(success.result)) {
        success.result.forEach(status => {
          let reservationStatus = maskResult(status.status)
          let msgData = {
            event: 'Validated New Booking',
            status: reservationStatus,
            message: 'Booking FOUND',
            'check-in-date': status.checkin_date,
            'check-out-date': status.checkout_date,
            guest: status.guest
          }
          let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify(msgData)}`
          logger.property_program(status.property_name, 'info', msg)
          toReturn.push(msgData)
        })
      }
      res.status(200).json({ data: toReturn })
    }
  })
}

const cancelledBooking = (req, res) => {
  let referenceNumbers = extractReferenceNumber(req)
  let auth = {
    username: config.secrets.temp.user,
    password: config.secrets.temp.pass
  }
  ddpClient(config.backend.ci, auth, referenceNumbers, (error, success) => {
    let status = ''
    if (
      error ||
      success === null ||
      success.result === undefined ||
      success.result.length === 0
    ) {
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
      let toReturn = []
      if (Array.isArray(success.result)) {
        success.result.forEach(status => {
          let reservationStatus = maskResult(status.status)
          let msgData = {
            event: 'Validated Cancelled Booking',
            status: reservationStatus,
            message: 'Booking FOUND',
            'check-in-date': status.checkin_date,
            'check-out-date': status.checkout_date,
            guest: status.guest
          }
          let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify(msgData)}`
          logger.property_program(status.property_name, 'info', msg)
          toReturn.push(msgData)
        })
      }
      res.status(200).json({ data: toReturn })
    }
  })
}

export default {
  newBooking,
  cancelledBooking
}

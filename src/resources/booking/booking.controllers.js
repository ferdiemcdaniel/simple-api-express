import config from '../../config'
import ddpClient from '../../utils/ddp'
import logger from '../../utils/logger'

const empireLink = config.backend
const auth = {
  username: config.secrets.temp.user,
  password: config.secrets.temp.pass
}
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
      return {
        status: Math.floor(Math.random() * (199 - 100) + 100),
        message: 'Booking FOUND'
      }
    case 300:
      return {
        status: Math.floor(Math.random() * (399 - 300) + 300),
        message: 'Booking FOUND'
      }
    default:
      return { status: 200, message: 'Booking NOT FOUND' }
  }
}

const newBooking = (req, res) => {
  let referenceNumbers = extractReferenceNumber(req)
  ddpClient(empireLink, auth, referenceNumbers, (error, success) => {
    let status = ''
    if (
      error ||
      success === null ||
      success.result === undefined ||
      !Array.isArray(success.result) ||
      success.result.length === 0
    ) {
      status = maskResult(200)
      let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify({
        event: 'Validated New Booking',
        status,
        message: `Booking${referenceNumbers.length > 1 ? 's' : ''} NOT FOUND`,
        reference:
          referenceNumbers.length > 1
            ? referenceNumbers.join()
            : referenceNumbers
      })}`
      logger.property_program('', 'info', msg)
      res.status(200).json({
        reservationsresponse: {
          status
        }
      })
    } else {
      let toReturn = []
      success.result.forEach(status => {
        let msgData
        let reservationStatus = maskResult(status.status)
        msgData = {
          event: 'Validated New Booking',
          status: reservationStatus.status,
          message: reservationStatus.message,
          reference: status.reference
        }
        if (reservationStatus.status !== 200) {
          msgData = {
            ...msgData,
            'check-in-date': status.checkin_date,
            'check-out-date': status.checkout_date,
            guest: status.guest
          }
        }
        let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify(msgData)}`
        logger.property_program(status.property_name, 'info', msg)
        toReturn.push(msgData)
      })
      res.status(200).json({ data: toReturn })
    }
  })
}

const cancelledBooking = (req, res) => {
  let referenceNumbers = extractReferenceNumber(req)
  ddpClient(empireLink, auth, referenceNumbers, (error, success) => {
    let status = ''
    if (
      error ||
      success === null ||
      success.result === undefined ||
      !Array.isArray(success.result) ||
      success.result.length === 0
    ) {
      status = maskResult(200)
      status = maskResult(200)
      let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify({
        event: 'Validated New Booking',
        status,
        message: `Booking${referenceNumbers.length > 1 ? 's' : ''} NOT FOUND`,
        reference:
          referenceNumbers.length > 1
            ? referenceNumbers.join()
            : referenceNumbers
      })}`
      logger.property_program('', 'info', msg)
      res.status(200).json({
        reservationsresponse: {
          status
        }
      })
    } else {
      let toReturn = []
      success.result.forEach(status => {
        let msgData
        let reservationStatus = maskResult(status.status)
        msgData = {
          event: 'Validated Cancelled Booking',
          status: reservationStatus.status,
          message: reservationStatus.message,
          reference: status.reference
        }
        if (reservationStatus.status !== 200) {
          msgData = {
            ...msgData,
            'check-in-date': status.checkin_date,
            'check-out-date': status.checkout_date,
            guest: status.guest
          }
        }
        let msg = `Vader Log: ${config.rootUrl} ${JSON.stringify(msgData)}`
        logger.property_program(status.property_name, 'info', msg)
        toReturn.push(msgData)
      })
      res.status(200).json({ data: toReturn })
    }
  })
}

export default {
  newBooking,
  cancelledBooking
}

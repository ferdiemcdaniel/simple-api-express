import { Router } from 'express'
import controllers from './booking.controllers'

const router = Router()

// /webhook/booking
router.route('/validate-new').post(controllers.newBooking)

router.route('/validate-cancel').post(controllers.cancelledBooking)

export default router

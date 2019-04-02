import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import bookingRouter from './resources/booking/booking.router'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Welcome to vader')
})

app.use('/webhook/booking', bookingRouter)

app.use('/config/lookup', (req, res) => {
  return res.status(201).json({
    url: process.env.ROOT_URL,
    env: process.env.NODE_ENV
  })
})

export const start = () => {
  let port = 5050
  app.listen(port, () => {
    console.log('Server started on ' + port)
  })
}

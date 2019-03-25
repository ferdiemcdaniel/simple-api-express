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

export const start = () => {
  let port = 8080
  app.listen(port, () => {
    console.log('Server started on ' + port)
  })
}

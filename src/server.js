import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import ddpClient from './utils/ddp'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Welcome to vader')
})

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
        const { reference } = JSON.parse(extractedJson)
        if (reference && typeof reference === 'string') {
          toReturn = reference
        }
      }
    })
  }
  return toReturn
}

const fetchPropertyStatus = referenceNumber => {
  let auth = {
    username: config.secrets.temp.user,
    password: config.secrets.temp.pass
  }
  var start = new Date().getTime()
  setTimeout(function() {
    ddpClient(config.backend.dev, auth, referenceNumber)
  }, 0)
}

app.post('/webhook-validate-new-booking', (req, res) => {
  let referenceNumber = extractReferenceNumber(req)
  const status = fetchPropertyStatus(referenceNumber)
  res.send({
    message: 'success',
    status: 'Pending',
    errors: []
  })
})

app.post('/webhook/new-booking', (req, res) => {})

export const start = () => {
  let port = 5000
  app.listen(port, () => {
    console.log('Server started on ' + port)
  })
}

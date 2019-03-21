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

app.post('/webhook-validate-new-booking', (req, res) => {
  let referenceNumber = extractReferenceNumber(req)
  let auth = {
    username: config.secrets.temp.user,
    password: config.secrets.temp.pass
  }
  ddpClient(config.backend.dev, auth, referenceNumber, (error, success) => {
    if (error) {
      res.status(500).json({
        reservationsresponse: {
          updated: 'Fail',
          error: error
        }
      })
    } else {
      res.status(200).json({
        reservationsresponse: {
          status: maskResult(success.result)
        }
      })
    }
  })
})

app.post('/webhook/new-booking', (req, res) => {})

export const start = () => {
  let port = 8080
  app.listen(port, () => {
    console.log('Server started on ' + port)
  })
}

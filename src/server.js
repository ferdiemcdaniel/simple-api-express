import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get("/", (req,res) => {
  res.send("Welcome to vader");
})

app.post("/webhook-validate-new-booking", (req, res) => {
  // {
  //   "OTA_ORDER_ID": "6REhCMwk"
  //   "BOOKING_ID":  "iwMCuK96r9xe1fTQedVA"
  // }
  console.log("webhook triggered: validating Booking "+req.BOOKING_ID);
  res.send({
    message: "success",
    status: "Pending",
    errors: []
  });

})

export const start = () => {
  let port = 5000;
  app.listen(port, () => {
    console.log('Server started on '+port)
  })
}

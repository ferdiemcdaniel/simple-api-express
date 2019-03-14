import DDPClient from 'ddp'

let ddpClient = (config, auth, referenceNumber) => {
  let ddpClient = new DDPClient({
    host: config.hostname,
    port: config.port,
    ssl: config.ssl,
    autoReconnect: true,
    maintainCollections: false,
    ddpVersion: '1',
    useSockJs: false
  })

  ddpClient.connect(error => {
    if (!error) {
      let authObj = {
        user: { username: auth.username },
        password: auth.password
      }
      ddpClient.call('login', [authObj], (err, res) => {
        if (!err) {
          console.log(res)
          console.log('logged in ' + referenceNumber)
          ddpClient.call(
            'validate_booking_papertrail',
            referenceNumber,
            (error, result) => {
              console.log(result)
              if (!error) {
                console.log(result)
              } else {
                console.log(error)
              }
            }
          )
        } else {
          console.log('1')
          console.log('error', err)
        }
      })
    } else {
      console.log(error)
    }
  })
}

export default ddpClient

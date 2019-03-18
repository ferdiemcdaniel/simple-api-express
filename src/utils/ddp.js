import DDPClient from 'ddp'

let ddpClient = (config, auth, referenceNumber, done) => {
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
          ddpClient.call(
            'validate_booking_papertrail',
            [{ reference_num: referenceNumber }],
            (error, result) => {
              if (!error) {
                callback(null, { result })
              } else {
                callback(err, null)
              }
            }
          )
        } else {
          callback(err, res)
        }
      })
    } else {
      callback(error, null)
    }
  })

  function callback(error, success) {
    ddpClient.close()
    done(error, success)
  }
}

export default ddpClient

export const config = {
  secrets: {
    jwt: 'learneverything',
    temp: {
      user: process.env.CONNECT_USER,
      pass: process.env.CONNECT_PASS
    }
  },
  backend: {
    hostname: 'stg.1day.io',
    port: 443,
    ssl: true
  },
  papertrail: {
    host: 'logs5.papertrailapp.com',
    port: 22744
  }
}

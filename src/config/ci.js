export const config = {
  secrets: {
    jwt: 'learneverything',
    temp: {
      user: process.env.CONNECT_USER,
      pass: process.env.CONNECT_PASS
    }
  },
  backend: {
    hostname: 'ci.1day.io',
    port: 443,
    ssl: true
  },
  papertrail: {
    host: 'logs6.papertrailapp.com',
    port: 36774
  }
}

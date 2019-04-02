export const config = {
  secrets: {
    jwt: 'learneverything',
    temp: {
      user: process.env.CONNECT_USER,
      pass: process.env.CONNECT_PASS
    }
  },
  backend: {
    hostname: 'localhost',
    port: 5000,
    ssl: false
  },
  papertrail: {
    host: 'logs6.papertrailapp.com',
    port: 36774
  },

  dbUrl: 'mongodb://localhost:27017/api-design'
}

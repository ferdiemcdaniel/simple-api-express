export const config = {
  secrets: {
    jwt: 'learneverything',
    temp: {}
  },
  backend: {
    ci: {
      hostname: 'ci.1day.io',
      port: 443,
      ssl: true
    },
    dev: {
      hostname: 'localhost',
      port: 4000,
      ssl: false
    }
  },
  dbUrl: 'mongodb://localhost:27017/api-design'
}

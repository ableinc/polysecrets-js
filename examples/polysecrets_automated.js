const { Polysecrets } = require('../lib/main')

config = {
    automated: true, // default = false
    interval: 5, // default = 30
    length: 10, // default
    uuid: true, // default (options: true, false, "Both")
    mixcase: false, // default
    secret: 'rAnd0m_s3cr3t',  // default (not required)
    persistence: {}, // or false / default: false
    verbose: true
  }


function polysecrets_automated () {
  let automated = new Polysecrets(config)
  automated.execute()
  automated.terminate()
}

process.on('SIGINT', () => {
  CONTINUE_LOOP = false
  process.exit()
})

polysecrets_automated()


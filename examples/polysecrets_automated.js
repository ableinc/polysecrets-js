const { Polysecrets } = require('../lib/main')

config = {
    automated: true,
    interval: 5, // seconds
    length: 15,
  }


function polysecrets_automated () {
  let automated = new Polysecrets(config) // new Polysecrets(config, true) - true will clear the secret from your environment
  automated.execute()
  automated.terminate()
}

process.on('SIGINT', () => {
  process.exit()
})

polysecrets_automated()


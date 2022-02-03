const { Polysecrets } = require('../lib/main')

config = {
    automated: true,
    interval: 5, // seconds
    length: 15,
    verbose: true // print the secret to console
  }

function polysecrets_automated () {
  let automated = new Polysecrets(config) // new Polysecrets(config, true) - 'true' will clear the secret from your environment
  automated.execute()

  process.on('SIGINT', () => {
    automated.terminate()
  })
}

polysecrets_automated()

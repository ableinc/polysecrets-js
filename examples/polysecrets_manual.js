const { Polysecrets } = require('../lib/main')

config = {
    automated: false, // default
    interval: 30, // default
    length: 15, // default = 10
    uuid: true, // default
    mixcase: false, // default 
    secret: 'rAnd0m_s3cr3t', // default (does not need to be provided)
    persistence: false, // default: false | {host: 'localhost', port: 27017, db: 'polysecrets', collection: 'secrets'}
    verbose: false // default
  }

function polysecrets_manual () {
  let secret = new Polysecrets(config)
  secret.execute()
    .then((secret) => {
      typeof secret === 'undefined' ? console.log('Manual - No secret') : console.log('Manual - Secret: ', secret)
    })
    .catch((err) => {
      throw err
    })
}

polysecrets_manual()

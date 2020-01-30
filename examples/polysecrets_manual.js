const { Polysecrets } = require('../lib/main')

config = {
    automated: false, // default
    length: 15, // default = 10
    uuid: true, // default
    mixcase: false, // default 
    secret: 'rAnd0m_s3cr3t', // default (does not need to be provided)
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

const { Polysecrets } = require('../lib/main')

config = {
    automated: false,
    interval: 30,
    length: 15,
    uuid: true,
    mixcase: false,
    secret: 'rAnd0m_s3cr3t',
    persistence: {}
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

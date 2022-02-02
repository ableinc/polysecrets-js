const { Polysecrets } = require('../lib/main')

config = {
    automated: false, // default
    length: 15, // default = 10
    uuid: true, // default
    mixcase: false, // default 
    secret: 'rAnd0m_s3cr3t', // default (does not need to be provided)
    verbose: false // default
  }

async function polysecrets_manual () {
  let polysecret = new Polysecrets(config)
  const secret = await polysecret.execute()
  console.log('Manual - Secret: ', secret)
}

polysecrets_manual()

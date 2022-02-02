const { Polysecrets } = require('../lib/main')

config = {
    length: 25,
    uuid: false,
    mixcase: true,
    secret: 'thIS_rAnd0m_s3cr3t',
  }

async function polysecrets_manual () {
  let polysecret = new Polysecrets(config)
  const secret = await polysecret.execute()
  console.log('(Manual) Secret: ', secret)
}

polysecrets_manual()

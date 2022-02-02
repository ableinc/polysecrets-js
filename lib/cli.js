var program = require('commander');
const { __version__ } = require('./version')
const { Polysecrets, Config } = require('./main')
 
program
  .name('polysecrets')
  .version(__version__)
  .description('A completely randomized order of secrets, with security in mind.')
  .option('-s, --secret [value]', 'The secret string', defaultValue = 'rAnd0m_s3cr3+')
  .option('-a, --automated [value]', 'Whether automatically produce secrets after every interval', defaultValue = false)
  .option('-i, --interval [value]', 'How frequently should a new secret be generated (seconds)', defaultValue = 30)
  .option('-l, --length [value]', 'Length of the secret. Secret has a minimum length of 10', defaultValue = 10)
  .option('-u, --uuid [value]', 'Whether to use UUIDs or Alphanumeric characters for secret generation - [true, false, "Both"]', defaultValue = true)
  .option('-m, --mixcase [value]', 'Decide whether or not to mix the case of alpha characters in secret string', defaultValue = false)
  .option('-p, --persistence [value]', 'Persist generated secrets to avoid duplicates.', defaultValue = {})
  .option('--verbose [value]', 'Feedback through console.', defaultValue = false)
  .parse(process.argv);

const config = {
  ...Config(),
  ...program.opts()
}
if (Object.keys(program.persistence).length !== 0) {
  config.usePersistence = true
}
const run = async () => {
  const polysecret = new Polysecrets(config)
  const secret = await polysecret.execute()
  secret === '' ? console.log('No secret') : typeof secret === 'undefined' ? console.log('[process.env] Secret: ', process.env.secret) : console.log('Secret: ', secret)

  process.on('SIGINT', () => {
    if (config.automated) { polysecret.terminate() }
  })
}

run()

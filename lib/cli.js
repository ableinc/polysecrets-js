var program = require('commander');
const { __version__ } = require('./version')
const { Polysecrets, DefaultConfig } = require('./main')
 
program
  .version(__version__, '-v', '--version')
  .name('polysecrets')
  .description('A completely randomized order of secrets, with security in mind.')
  .option('-s, --secret [value]', 'The secret string', defaultValue = 'rAnd0m_s3cr3+')
  .option('-a, --automated [value]', 'Whether automatically produce secrets after every interval', defaultValue = false)
  .option('-i, --interval [value]', 'How frequently should a new secret be generated (seconds)', defaultValue = 30)
  .option('-l, --length [value]', 'Length of the secret. Secret has a minimum length of 10', defaultValue = 10)
  .option('-u, --uuid [value]', 'Whether to use UUIDs or Alphanumeric characters for secret generation - [true, false, "Both"]', defaultValue = true)
  .option('-m, --mixcase [value]', 'Decide whether or not to mix the case of alpha characters in secret string', defaultValue = false)
  .option('-vV, --verbose [value]', 'Feedback through console.', defaultValue = true)
  .option('-p, --persistence [value[', 'Persist generated secrets to avoid duplicates.', defaultValue = {})
  .parse(process.argv);

const config = DefaultConfig()

config.secret = program.secret
config.automated = program.automated
config.interval = program.interval
config.length = program.length
config.uuid = program.uuid
config.mixcase = program.mixcase
config.verbose = program.verbose
if (Object.keys(program.persistence).length !== 0) {
  config.usePersistence = true
  config.persistence = program.persistence
}
const secret = new Polysecrets(config)
try {
    if (config.automated) {
      secret.execute()
      process.on('SIGINT', () => {
        secret.terminate()
      })
    } else {
      secret.execute()
        .then((polysecret) => {
          polysecret === '' ? console.log('No secret') : console.log(polysecret)
        })
        .catch((err) => {
          console.error(`Error Encountered: ${err}`)
        })
    }
} catch (err) {
  console.error(`Error Encountered: ${err}`)
}

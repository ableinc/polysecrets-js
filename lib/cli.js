var program = require('commander');
const { __version__ } = require('./version')
const { Polysecrets } = require('./main')
 
program
  .version(__version__, '-v', '--version')
  .name('polysecrets')
  .description('A completely randomized order of secrets, with security in mind.')
  .option('-s, --secret [value]', 'The secret string')
  .option('-a, --automated [value]', 'Whether automatically produce secrets after every interval', defaultValue = false)
  .option('-i, --interval [value]', 'How frequently should a new secret be generated (seconds)', defaultValue = 30)
  .option('-l, --length [value]', 'Length of the secret. Secret has a minimum length of 10', defaultValue = 10)
  .option('-u, --uuid [value]', 'Whether to use UUIDs or Alphanumeric characters for secret generation - [true, false, "Both"]', defaultValue = true)
  .option('-m, --mixcase [value]', 'Decide whether or not to mix the case of alpha characters in secret string', defaultValue = false)
  .option('-vV, --verbose [value]', 'Feedback through console.', defaultValue = true)
  .parse(process.argv);

let errors
try {
    if (program.automated) {
      let secret = new Polysecrets(program)
      secret.automate()
      process.on('SIGINT', () => {
          secret.stop_automated()
      })
    } else {
      let secret = new Polysecrets(program).execute()
      secret
        .then((secret) => {
          secret === '' ? console.log('No secret') : console.log(secret)
        })
        .catch((err) => {
          console.log('error')
          errors = true
          throw err
        })
    }
} catch (err) {
    console.error(`Error Encountered: ${err}`)
} finally {
  errors ? process.exit(1) : process.exit()
}

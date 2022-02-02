# Polysecrets
![alt text](https://img.icons8.com/dotty/80/000000/mesh.png "Polysecrets Logo")
A completely randomized order of secrets; built with security in mind. Secrets can be automatically generated
on a time interval or manually generated. Polysecrets keeps the guessing away from the human in exchange for
a truly secret, randomized signing order. Instead of a hardcoded secret that can be stolen during a security
breach, Polysecrets, randomizes the provided string in a way that a secret produced at 8:00pm can be completely
different from a secret produced at 8:01pm, on the same server.

# Install
Locally
```bash
git clone https://github.com/ableinc/polysecrets-js.git
cd polysecrets-js
npm install
npm run manual
# or
npm run automated
```

Npm
```bash
npm install --save polysecrets
```

# How To Use
Polysecrets-js can be used manually or automated. Automated use can be provided a time (in seconds) for
how often a new secret should be generated, the default time is set to 30 seconds. You do not have
to provide a secret to Polysecrets class, but you can if you'd like certain characters in your secret. Reminder, the secret is a collection of randomly ordered characters, so the secret you provide will not be used entirely. You can choose whether or not to have a mix of upper and lower case letters in the final secret output. By default the case is kept how ever its provided.<br />

**Look through examples folder** <br />
Automated (this will add the secret to your environment)

```javascript
const { Polysecrets } = require('polysecrets')

// do not provide an empty config.
// to use defaults, please do not
// use config parameter field
config = {
    automated: true, // default = false
    interval: 5, // default = 30
    length: 10, // default
    uuid: true, // default (options: true, false, "Both")
    mixcase: false, // default
    secret: 'rAnd0m_s3cr3t',  // default (not required)
    verbose: true // default = false
  }
function polysecrets_automated () {
  let automated = new Polysecrets(config)
  automated.execute()
  automated.terminate()
}

process.on('SIGINT', () => {
  process.exit()
})

polysecrets_automated()
```

```javascript
const { Polysecrets } = require('polysecrets')

// do not provide an empty config.
// to use defaults, please do not
// use config parameter field
config = {
    automated: false,
    length: 15,
    uuid: true,
    mixcase: false,
    secret: 'rAnd0m_s3cr3t'
  }

async function polysecrets_manual () {
  const polysecret = new Polysecrets(config)
  const secret = await secret.execute()
  return secret
}
polysecrets_manual()
```

# Options
You can do the following with Polysecrets-js:
* Manually or Automatically generate new secrets
* Change time interval for new secret generation (for Automated feature)
* Change the length of the final Polysecrets secret (refer to Notes at end of README)
* Choose whether to generate secrets with just UUIDs, Alphanumeric characters or both
* Choose whether to mix the case of each letter in the secret. i.e. a mix of upper and lower case letters (hELlO).
* Persist generated secrets to ensure the same secret isn't used twice

The CLI (below) has full details of each option (except automated option)

# Polysecrets-js CLI 
```bash
Usage: polysecrets [options]

A completely randomized order of secrets, with security in mind.

Options:
  -v                         output the version number
  -s, --secret [value]       The secret string (default: "rAnd0m_s3cr3+")
  -a, --automated [value]    Whether automatically produce secrets after every interval (default: false)
  -i, --interval [value]     How frequently should a new secret be generated (seconds) (default: 30)
  -l, --length [value]       Length of the secret. Secret has a minimum length of 10 (default: 10)
  -u, --uuid [value]         Whether to use UUIDs or Alphanumeric characters for secret generation - [true, false, "Both"] (default: true)
  -m, --mixcase [value]      Decide whether or not to mix the case of alpha characters in secret string (default: false)
  -vV, --verbose [value]     Feedback through console. (default: true)
  -p, --persistence [value[  Persist generated secrets to avoid duplicates. (default: {})
  -h, --help                 output usage information
 ```

# Benefits
* JSON Web Tokens
* Certificate Signing
* Hashing
* Various scenarios of Cryptography

# Note
- If you change the length of the secret via the 'length' parameter, you will notice that the 
secret string you provided will not contain all the characters provided. If you want the final
secret to contain all the exact same characters, then provide the exact string length to 
Polysecrets 'length' field.

- The secret provided in the config is just used as reference characters and are not
guaranteed to be a part of the final secret. If you would like to use the secret you
provide I would recommend going the traditional route; add secret to your project 
.env file and use the dotenv package library.

- You cannot run manual and automated in the same file. You will throw an error.


# Persistence
- Do not include persistence as an empty object. Omit if you're not using it and set flag ```usePersistence``` to ```false```.
- Only configured for MongoDB. If you'd like SQL, create a PR.

# Default Configuration Options
Below are the default configuration options. You'll notice that ```usePersistence``` is ```false```, but we're setting ```persistence```. This is for the programs use only. If you are providing your own config and ```usePersistence``` is ```false```, **DO NOT** set ```persistence```
```javascript
{
    automated: false, 
    interval: 30, 
    length: 10, 
    uuid: true, 
    mixcase: false,
    secret: 'rAnd0m_s3cr3+',
    verbose: false,
    usePersistence: false,
    persistence: {host: 'localhost', port: 27017, db: 'polysecrets', collection: 'secrets'}
  }
```

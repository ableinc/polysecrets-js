# Polysecrets (v1.0.3)

![alt text](https://img.icons8.com/dotty/80/000000/mesh.png "Polysecrets Logo")
A completely randomized order of secrets; built with security in mind. Secrets can be automatically generated
on a time interval or manually generated. Polysecrets keeps the guessing away from the human in exchange for
a truly secret, randomized signature. Instead of a hardcoded secret that can be stolen during a security
breach, Polysecrets, randomizes the provided string in a way that a secret produced at 8:00pm can be completely different from a secret produced at 8:01pm, on the same server.

## Install

Locally

```bash
git clone https://github.com/ableinc/polysecrets-js.git
cd polysecrets-js
npm install
```

Npm

```bash
npm install --save polysecrets
```

## How To Use

Polysecrets can be used manually or automated. Automated use can be provided a time (in seconds) for
how often a new secret should be generated, the default time is set to 30 seconds. You do not have to provide a secret to Polysecrets class, but you can if you'd like certain characters in your secret. Reminder, the secret is a collection of randomly ordered characters, so the secret you provide will not be used entirely. You can choose whether or not to have a mix of upper and lower case letters in the final secret output. By default the case is kept how ever its provided.

***Manual***

```javascript
const { Polysecrets } = require('polysecrets')

// this example uses the default configuration variables
const polysecret = new Polysecrets()
async function polysecrets_manual () {
  const secret = await polysecret.execute()
  console.log(secret)
}
polysecrets_manual()
```

***Automated*** (this will add the secret to your environment)

```javascript
const { Polysecrets } = require('polysecrets')

// do not provide an empty config.
// to use defaults, please do not
// use config parameter field
config = {
    automated: true,
    verbose: true,
    interval: 5
  }
function polysecrets_automated () {
  const polysecrets = new Polysecrets(config)
  polysecrets.execute()

  process.on('SIGINT', () => {
    polysecrets.terminate()
  })
}

polysecrets_automated()
```

## Examples

For examples you can run the files found in the ```/examples``` folder.
If you've installed Polysecrets via ```git``` then ```cd``` into the repo
directory and run either of the following commands:

```bash
npm run manual

npm run automated
```

## Options

You can do the following with Polysecrets-js:

* Manually or Automatically generate new secrets
* Change time interval for new secret generation (for Automated feature)
* Change the length of the final Polysecrets secret (refer to Notes at end of README)
* Choose whether to generate secrets with just UUIDs, Alphanumeric characters or both
* Choose whether to mix the case of each letter in the secret. i.e. a mix of upper and lower case letters (hELlO).
* Persist generated secrets to ensure the same secret isn't used twice

## Polysecrets-js CLI

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

## Benefits

* JSON Web Tokens
* Certificate Signing
* Hashing
* Various scenarios of Cryptography

## Notes

* If you change the length of the secret via the 'length' parameter, you will notice that the
secret string you provided will not contain all the characters provided. If you want the final
secret to contain all the exact same characters, then provide the exact string length to
Polysecrets 'length' field.

* The secret provided in the config is just used as reference characters and are not
guaranteed to be a part of the final secret. If you would like to use the secret you
provide I would recommend going the traditional route; add secret to your project
.env file and use the dotenv package library.

* You cannot run manual and automated in the same file. You will throw an error.

## Persistence

* Do not include persistence as an empty object. Omit if you're not using it and set flag ```usePersistence``` to ```false```.

* Only created for MongoDB. If you'd like SQL, create a PR.

## Default Configuration Options

Below are the default configuration options. You'll notice that ```usePersistence``` is ```false```, but we're setting ```persistence```. This is for the programs use only. If you are providing your own config and ```usePersistence``` is ```false```, **DO NOT** set ```persistence```

```javascript
{
    automated: false, 
    interval: 30, // seconds
    length: 10, 
    uuid: true, // (options: true, false, "Both")
    mixcase: false,
    secret: 'rAnd0m_s3cr3+',
    verbose: false,
    usePersistence: false,
    persistence: {host: 'localhost', port: 27017, db: 'polysecrets', collection: 'secrets'}
  }
```

You can also import the ```Config``` function as such:

```javascript
const { Config } = require('polysecrets')

const config = Config() // returns an Object
````

## Changelog

***February 2022*** v1.0.3

* Updated CLI tool
* Fixed automated bug binding issue
* Updated ```examples/``` folder
* Updated documentation

***February 2022*** v1.0.2

* Simplified code in main module
* Simplified code in CLI tool
* Fixed bug with secret being displayed during automated call
* The secret will now only be removed when clearing env variables, instead of clearing all variables
* Fixed bug with persistence where secret was being added before the duplication check
* Updated verbose messages
* Command line tool will be added to path automatically
* Updated documentation

***February 2022*** v1.0.1

* Fixed bug related to persistence (MongoDB is still the only supported DB)
* Fixed bug related to the default configuration and how they are set
* The CLI tool was updated to address bugs and removed redundant code
* bson is installed as a dependency of another library required by Polysecrets.
There is a security vulnerability in bson that is addressed by updating the library.
This has been done for Polysecrets.
* README documentation has been updated for clarity, as well as the examples
in the ```examples/``` directory

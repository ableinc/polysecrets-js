const uuidv4 = require('uuid/v4')

const Time = {
  /**
   * A time in seconds for how long the program should wait until running agian
   * @param {Number} seconds Number of seconds to wait
   */
  sleep (seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
  }
}

const DefaultConfig = () => {
  return {
    automated: false, 
    interval: 30, 
    length: 10, 
    uuid: true, 
    mixcase: false,
    secret: 'rAnd0m_s3cr3+',
    verbose: false,
    secretKeyName: 'secret',
    usePersistence: false,
    persistence: {host: 'localhost', port: 27017, db: 'polysecrets', collection: 'secrets'}
  }
}

class Module {
  constructor(config = DefaultConfig(), clear_on_exit = false) {
    this.config = this.__config__(config)
    this._intervalId
    this._one_uuid = String(uuidv4()).substring(0, 15)
    this._alpha_numeric_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                                'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6',
                                '7', '8', '9']
    this._sec_phrase = this.config.secret
    this._sec_arr = []

    if (clear_on_exit) {
      process.on('exit', () => {
        delete process.env[this.config.secretKeyName]
      })
    }
    if (this.config.persistence && this.config.verbose) { console.log('Note: frequency in secret change when compared to the interval in seconds set may vary due to the ORM execution time for database queries.') }
  }

  __config__(_config) {
    const config = {
      ...DefaultConfig(),
      ..._config
    }
    if (!config.usePersistence) {
      delete config.persistence
    }
    return config
  }

  getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max.length))
  }

  __persistence(secret) {
    const MongoClient = require('mongodb').MongoClient
    let url = ''
    if (this.config.persistence.host.includes('https://')) {
      url = this.config.persistence.host
    } else {
      url = `mongodb://${this.config.persistence.host}:${this.config.persistence.port}`
    }
    MongoClient.connect(url, (err, client) => {
      if (err) {
        if (this.config.verbose) {
          console.log('Error occurred during MongoClient::connect(). Please refer to the stack displayed.')
        }
        throw err
      }
      const dbName = this.config.persistence.db
      const collectionName = this.config.persistence.collection
      const db = client.db(dbName)
      const collection = db.collection(collectionName)
      const _prev_used_secret = collection.find({'secret': secret})
      if (_prev_used_secret !== null || _prev_used_secret.length > 0) {
        return false
      }
      collection.insertOne({'secret': secret, 'createdAt': new Date})
      return true
    })
  }

  async __randomization(arr, lst, return_val = false) {
    let switcher = ['upper', 'lower', 'upper', 'lower', 'upper', 'lower']  // increase probability
    let random_item_in_list = String(lst[await this.getRandomInt(lst)])
    let case_state = switcher[await this.getRandomInt(switcher)]
    let upper_case = ''
    if (this.config.mixcase) {
      if (!isNaN(random_item_in_list) && case_state === 'upper') {
        upper_case = random_item_in_list.toUpperCase()
      }
    }
    if (return_val) { return upper_case != '' ? arr.push(upper_case) : arr.push(random_item_in_list) }
    upper_case !== '' ? arr.push(upper_case) : arr.push(random_item_in_list)
  }

  async __length_confirmation__(final_secret) {
    if (final_secret.length < this.config.length) {
      for (let i = 0; i < (this.config.length - final_secret.length); i++) {
        await this.__randomization(this._sec_arr, this._alpha_numeric_list)
      }
      return String(this._sec_arr.join('')).substr(0, this.config.length)
    }
    return final_secret
  }

  __persistence_loop(final_secret) {
    const fetchSecrets = () => {
      if (this.__persistence(final_secret)) {
        return final_secret
      } else {
        this._intervalId = setTimeout(fetchSecrets, this.config.interval * 1000)
      }
    }
    fetchSecrets()
  }

  async __secret_generator() {
    if (this.config.automated) { this._one_uuid = String(uuidv4()).substring(0, 15) }
    for (let i = 0; i < this._sec_phrase.length; i++) {
      await this.__randomization(this._sec_arr, this._sec_phrase)
      switch (this.config.uuid) {
        case true:
          await this.__randomization(this._sec_arr, this._one_uuid) 
        case false:
          await this.__randomization(this._sec_arr, this._alpha_numeric_list)
        case 'Both':
          await this.__randomization(this._sec_arr, this._one_uuid)
          await this.__randomization(this._sec_arr, this._alpha_numeric_list)
        default:
          await this.__randomization(this._sec_arr, this._one_uuid) 
      }
    }
    let _final_secret = await this.__length_confirmation__(String(this._sec_arr.join('')).substr(0, this.config.length))
    this._sec_arr = []
    if (this._sec_arr.length > 0) { throw new Error('Array not empty.') }
    return this.config.usePersistence && typeof this.config.persistence !== 'undefined' ? this.__persistence_loop(_final_secret) : _final_secret
  }

  async start () {
    if (this.config.automated) {
      const secret = await this.__secret_generator()
      process.env[this.config.secretKeyName] = secret
      if (this.config.verbose) { typeof process.env[this.config.secretKeyName] === 'undefined' ? console.log('No secret') : console.log('Secret: ', process.env[this.config.secretKeyName]) }
      this._intervalId = setTimeout(this.start.bind(this), this.config.interval * 1000)
    } else {
      return this.__secret_generator()
    }
  }

  stop () {
    clearTimeout(this._intervalId)
  }
}

class Polysecrets {
  constructor (config, clear_on_exit=false) {
    this.config = config
    this.clear_on_exit = clear_on_exit
    this.polysecrets = null
  }

  execute () {
    this.polysecrets = new Module(this.config, this.clear_on_exit)
    return this.polysecrets.start()
  }

  terminate () {
    this.polysecrets.stop()
  }
}

module.exports = {
  Time,
  Polysecrets,
  Config: DefaultConfig
}

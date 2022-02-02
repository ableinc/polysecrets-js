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
    usePersistence: false,
    persistence: {host: 'localhost', port: 27017, db: 'polysecrets', collection: 'secrets'}
  }
}

class PolysecretsClass {
  constructor(config = DefaultConfig(), clear_on_exit = false) {
    this.config = this.__config__(config)
    this._intervalId
    this._one_uuid = String(uuidv4()).substr(0, 15)
    this._alpha_numeric_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                                'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6',
                                '7', '8', '9']
    this._sec_phrase = this.config.secret
    this._sec_arr = []

    if (clear_on_exit) {
      process.on('exit', () => {
        process.env = {}
      })
    }
    this.__secret_generator.bind(this)
    if (this.config.persistence) { console.log('Persistence is still in Beta testing. Results may vary.') }
  }

  __config__(obj) {
    let _defaults = obj

    if (typeof _defaults.usePersistence !== 'undefined' && _defaults.usePersistence === false) {
      delete _defaults.persistence
    }
    
    for (let key of Object.keys(_defaults)) {
      if (typeof obj[key] !== 'undefined' && typeof obj[key] !== typeof _defaults[key]) {
          throw new Error(`${key} has invalid type. You should have ${typeof _defaults[key]}, but you have ${typeof _defaults[key]}.`)
      }
    }
    if (typeof obj.persistence !== 'undefined') {
      for (let key of Object.keys(_defaults.persistence)) {
        if (typeof obj.persistence[key] !== typeof _defaults.persistence[key]) {
          throw new Error(`Persistence: ${obj.persistence[key]} has invalid type. You should have ${typeof _defaults.persistence[key]}, but you have ${typeof _defaults.persistence[key]}.`)
        }
      }
    }
    return obj
  }

  getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max.length))
  }

  __persistence(secret) {
    const MongoClient = require('mongodb').MongoClient
    let url = ''
    let db = ''
    let collection = ''
    const dbName = this.config.persistence.db
    const collectionName = this.config.persistence.collection

    if (this.config.persistence.host.includes('https://')) {
      url = this.config.persistence.host
    } else {
      url = `mongodb://${this.config.persistence.host}:${this.config.persistence.port}`
    }
    MongoClient.connect(url, (err, client) => {
      if (err) { throw err }
      db = client.db(dbName)
      collection = db.collection(collectionName)
      let _prev_used_secret = collection.find({'secret': secret})
      collection.insertOne({'secret': secret, 'createdAt': new Date})
      if (_prev_used_secret !== null || _prev_used_secret.length > 0) {
        return false
      }
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
      for (var i = 0; i < (this.config.length - final_secret.length); i++) {
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
    if (this.config.automated) { this._one_uuid = String(uuidv4()).substr(0, 15) }
    for (var i = 0; i < this._sec_phrase.length; i++) {
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
    return typeof this.config.persistence !== 'undefined' ? this.__persistence_loop(_final_secret) : _final_secret
  }

  start () {
    if (this.config.automated) {
      const fetchSecrets = () => {
        this.__secret_generator()
          .then((secret) => {
            process.env.secret = secret
            if (this.config.verbose) { typeof process.env.secret === 'undefined' ? console.log('No secret') : console.log('Secret: ', process.env.secret) }
            this._intervalId = setTimeout(fetchSecrets, this.config.interval * 1000)
          })
          .catch((err) => {
            throw err
          })
      }
      fetchSecrets()
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
    this.polysecrets = new PolysecretsClass(this.config, this.clear_on_exit)
    return this.polysecrets.start()
  }

  terminate () {
    this.polysecrets.stop()
  }
}

module.exports = {
  Time,
  Polysecrets
}

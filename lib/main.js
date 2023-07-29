const crypto = require("crypto");

const Time = {
  /**
   * A time in seconds for how long the program should wait until running agian
   * @param {Number} seconds Number of seconds to wait
   */
  sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  },
};

const DefaultConfig = () => {
  return {
    automated: false,
    interval: 30,
    length: 15,
    verbose: false,
    persistence: null,
  };
};

class Module {
  constructor(config = DefaultConfig(), clear_on_exit = false) {
    this.config = this.__config(config);
    this._intervalId;
    this.chars = "abcdefghijklmnopqrstuvlwzyx0123456789!@#$&*_-+";
    this._sec_arr = [];
    let bootMessages = "";

    if (clear_on_exit) {
      process.on("exit", () => {
        delete process.env.secret;
      });
    }
    // On CRTL+C terminate
    process.on("SIGINT", () => {
      if (this.config.automated) {
        this.stop();
      }
    });

    // Append boot messages
    if (this.config.persistence !== null) {
      bootMessages += "Note: Persistence enabled.\n";
    }
    if (this.config.automated) {
      bootMessages += "Note: Automated mode enabled.\n";
    }
    if (this.config.verbose) {
      console.log(bootMessages);
    }
  }

  __config(config) {
    return {
      ...DefaultConfig(),
      ...config,
    };
  }

  getRandomInt(maxInt) {
    return crypto.randomInt(0, maxInt);
  }

  getRandomLetterNumberSymbol() {
    return this.chars[this.getRandomInt(this.chars.length)];
  }

  __persistence(secret) {
    const MongoClient = require("mongodb").MongoClient;
    MongoClient.connect(this.config.persistence, (err, client) => {
      if (err) {
        if (this.config.verbose) {
          console.error(
            `Error occurred in MongoClient::connect() - Unable to persist. Reason: ${
              err.message
            } - Timestamp: ${new Date().toISOString()}`
          );
        }
        return false;
      }
      const collection = client.db("polysecrets").collection("secrets");
      collection.insertOne({
        secret: secret,
        createdAt: new Date().toISOString(),
      });
      return true;
    });
  }

  __randomizer(letterNumberSymbol) {
    let switcher = ["upper", "lower"];
    let case_state = switcher[this.getRandomInt(switcher.length)];
    if (!isNaN(letterNumberSymbol)) {
      if (this.config.mixcase) {
        letterNumberSymbol =
          case_state === "upper"
            ? case_state.toLocaleUpperCase()
            : case_state.toLocaleLowerCase();
      }
    }
    return letterNumberSymbol;
  }

  __secret_generator() {
    let final_secret = "";
    for (let i = 0; i < this.config.length; i++) {
      let randomLetterNumberSymbol = this.getRandomLetterNumberSymbol();
      final_secret += this.__randomizer(randomLetterNumberSymbol);
    }
    if (this.config.persistence !== null) {
      this.__persistence(final_secret);
    }
    return final_secret;
  }

  start() {
    if (this.config.automated) {
      this._intervalId = setInterval(async () => {
        const secret = this.__secret_generator();
        process.env.secret = secret;
        if (this.config.verbose) {
          console.log(`Secret: ${secret}`);
        }
      }, this.config.interval * 1000);
    } else {
      return this.__secret_generator();
    }
  }

  stop() {
    clearInterval(this._intervalId);
  }
}

class Polysecrets {
  constructor(config, clear_on_exit = false) {
    this.config = config;
    this.clear_on_exit = clear_on_exit;
    this.polysecrets = null;
  }

  execute() {
    this.polysecrets = new Module(this.config, this.clear_on_exit);
    return this.polysecrets.start();
  }

  terminate() {
    this.polysecrets.stop();
  }
}

module.exports = {
  Time,
  Polysecrets,
  Config: DefaultConfig,
};

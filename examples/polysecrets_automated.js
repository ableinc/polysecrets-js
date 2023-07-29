const { Polysecrets, Config } = require("../lib/main");

const config = Config();
config.automated = true;
config.interval = 5; // seconds
config.length = 15;
config.verbose = true; // print the secret to console

function polysecrets_automated() {
  let automated = new Polysecrets(config, true); // new Polysecrets(config, true) - 'true' will clear the secret from your environment
  automated.execute();
}

polysecrets_automated();

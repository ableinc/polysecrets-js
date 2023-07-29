const { Polysecrets, Config } = require("../lib/main");

const config = Config();
config.length = 25;

function polysecrets_manual() {
  let polysecret = new Polysecrets(config);
  const secret = polysecret.execute();
  console.log("(Manual) Secret: ", secret);
}

polysecrets_manual();

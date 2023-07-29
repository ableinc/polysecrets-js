#!/usr/bin/env node

var program = require("commander");
const { __version__ } = require("./version");
const { Polysecrets, Config } = require("./main");

program
  .name("polysecrets")
  .version(__version__)
  .description(
    "A completely randomized order of secrets, with security in mind."
  )
  .option(
    "-a, --automated [value]",
    "Whether automatically produce secrets after every interval",
    (defaultValue = false)
  )
  .option(
    "-i, --interval [value]",
    "How frequently should a new secret be generated (seconds)",
    (defaultValue = 30)
  )
  .option(
    "-l, --length [value]",
    "Length of the secret. Secret has a minimum length of 10",
    (defaultValue = 15)
  )
  .option(
    "-p, --persistence [value]",
    "Persist generated secrets to a MongoDB database",
    (defaultValue = null)
  )
  .option(
    "--verbose [value]",
    "Feedback through console.",
    (defaultValue = false)
  )
  .parse(process.argv);

(function run() {
  const polysecrets = new Polysecrets({ ...Config, ...program.opts() });
  const secret = polysecrets.execute();
  if (!polysecrets.config.automated) {
    console.log("Secret: ", secret);
  }
})();

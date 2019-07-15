const chalk = require('chalk');
const moment = require('moment');

const hourFormat = 'DD/MM/YYYY h:mm:ss a';

module.exports = {
  ERROR_FATAL: message => console.log(chalk.bold.white.bgRed(`[${moment().format(hourFormat)}][ERROR]: ${message}`)),
  LOG: message => console.log(`[${moment().format(hourFormat)}][LOG]: ${message}`),
  WARNING: message => console.log(chalk.bold.yellow(`[${moment().format(hourFormat)}][WARNING]: ${message}`)),
};
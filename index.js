const { parsed } = require('dotenv').config();
const { ERROR_FATAL, LOG, WARNING } = require('./src/configuration/logs');
const SYSTEM_DEFAULT = require('./src/configuration/defaults');

const express = require('express');
const bodyParser = require('body-parser');
let app;

const ROUTE_CB_WRAPPER = (req, res, cb) => {
  LOG(`Request received: ${req.method} "${req.originalUrl}"\
${Object.keys(req.body).length ? `, body=${req.body}` : ''}`);
  cb(req, res);
};

const init = () => {
  if (!parsed || !parsed.wsboot) {
    ERROR_FATAL('Configuration object "wsboot" not found. Check your ".env" file.');
    return;
  }

  let wsbootConfig;
  try {
    wsbootConfig = JSON.parse(parsed.wsboot);
  } catch (error) {
    ERROR_FATAL(`Could not parse WSBoot configuration from ".env" file. Found error was ${error}`);
    ERROR_FATAL('Please, check your ".env" file, and ensure configuration entry "wsboot" has a valid JSON syntax');
    return;
  }
  if (!wsbootConfig) {
    ERROR_FATAL('Could not load WSBoot configuration. Aborting system startup.');
    return;
  }

  if (!wsbootConfig.port) {
    WARNING(`WSBoot configuration "port" not found. Using default ${SYSTEM_DEFAULT.port}`);
  }

  LOG('Starting WSBoot web service');
  app = express();
  app.use(express.json());
  app.listen(wsbootConfig.port || SYSTEM_DEFAULT.port);
  LOG(`WSBoot web service successfully started. Listening on port ${wsbootConfig.port || SYSTEM_DEFAULT.port}`);
};

const all = (route, cb) => {
  app.all(route, (req, res) => {});
};

const expressDelete = (route, cb) => app.delete(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const get = (route, cb) => app.get(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const post = (route, cb) => app.post(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const put = (route, cb) => app.put(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

module.exports = {
  all,
  delete: expressDelete,
  get,
  init,
  post,
  put,
};
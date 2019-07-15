const { parsed } = require('dotenv').config();
const { ERROR_FATAL, LOG, WARNING } = require('./src/configuration/logs');
const SYSTEM_DEFAULT = require('./src/configuration/defaults');

const express = require('express');
let app;

const ROUTE_CB_WRAPPER = (req, res, cb) => {
  console.log(req.body);
  LOG(`Request received: ${req.method} "${req.originalUrl}"\
${Object.keys(req.body).length ? `, body=${JSON.stringify(req.body)}` : ''}`);
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

  if (!wsbootConfig.bodyType) {
    WARNING(`WSBoot configuration "bodyType" not found. Using default "${SYSTEM_DEFAULT.bodyType}"`);
    app.use(express.json());
  } else switch (wsbootConfig.bodyType) {
    case 'json':
      LOG('Body parser configured for type "JSON"');
      app.use(express.json());
      break;
    case 'raw':
      LOG('Body parser configured for type "raw"');
      app.use(express.raw());
      break;
    case 'text':
      LOG('Body parser configured for type "text"');
      app.use(express.text());
      break;
    case 'urlencoded':
      LOG('Body parser configured for type "urlencoded"');
      app.use(express.urlencoded());
      break;
    default:
      WARNING('WSBoot configuration "bodyType" has invalid value. Only the following are acceptable: "json", "raw", "text" and "urlencoded".');
      WARNING(`Using default value ${SYSTEM_DEFAULT.bodyType}`);
      app.use(express.json());
      break;
  }

  app.listen(wsbootConfig.port || SYSTEM_DEFAULT.port);
  LOG(`WSBoot web service successfully started. Listening on port ${wsbootConfig.port || SYSTEM_DEFAULT.port}`);
};

const all = (route, cb) => app.all(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const httpDelete = (route, cb) => app.delete(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const get = (route, cb) => app.get(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const post = (route, cb) => app.post(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

const put = (route, cb) => app.put(route, (req, res) => ROUTE_CB_WRAPPER(req, res, cb));

module.exports = {
  all,
  delete: httpDelete,
  get,
  init,
  post,
  put,
};
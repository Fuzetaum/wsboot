const express = require('express');
const cors = require('cors');

const { context, log } = require('@ricardofuzeto/ws-core');
const SYSTEM_DEFAULT = require('./src/configuration/defaults');

const { properties } = context;

let app;

const ROUTE_CB_WRAPPER = (req, res, cb) => {
  log.LOG(`Request received: ${req.method} "${req.originalUrl}"\
${Object.keys(req.body).length ? `, body=${JSON.stringify(req.body)}` : ''}`);
  cb(req, res);
};

const init = () => {
  const wsbootProperties = properties.get('boot');
  if (!wsbootProperties) {
    log.ERROR_FATAL('Configuration object "boot" not found. Check your "application.json" file.');
    process.exit(1);
  }
  if (!wsbootProperties.port) {
    log.WARNING(`WSBoot configuration property "port" not found. Using default ${SYSTEM_DEFAULT.port}`);
  }

  log.LOG('Starting WSBoot web service');
  app = express();

  if (!wsbootProperties.bodyType) {
    log.WARNING(`WSBoot configuration property "bodyType" not found. Using default "${SYSTEM_DEFAULT.bodyType}"`);
    app.use(express.json());
  } else switch (wsbootProperties.bodyType) {
    case 'json':
      log.LOG('Body parser configured for type "JSON"');
      app.use(express.json());
      break;
    case 'raw':
      log.LOG('Body parser configured for type "raw"');
      app.use(express.raw());
      break;
    case 'text':
      log.LOG('Body parser configured for type "text"');
      app.use(express.text());
      break;
    case 'urlencoded':
      log.LOG('Body parser configured for type "urlencoded"');
      app.use(express.urlencoded());
      break;
    default:
      log.WARNING('WSBoot configuration "bodyType" has invalid value. Only the following are acceptable: "json", "raw", "text" and "urlencoded"');
      log.WARNING(`Using default value ${SYSTEM_DEFAULT.bodyType}`);
      app.use(express.json());
      break;
  }

  app.use(cors());
  app.listen(wsbootProperties.port || SYSTEM_DEFAULT.port);
  log.LOG(`WSBoot web service successfully started. Listening on port ${wsbootProperties.port || SYSTEM_DEFAULT.port}`);
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
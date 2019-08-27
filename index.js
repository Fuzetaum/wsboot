const express = require('express');
const cors = require('cors');

const { context, log } = require('@ricardofuzeto/ws-core');
const SYSTEM_DEFAULT = require('./src/configuration/defaults');

const { paginated } = require('./src/expressRes');

const { properties } = context;
const DEFAULT_OPTIONS = {
  paginated: false,
  pageSize: 20,
};

let app;

const ROUTE_CB_WRAPPER = (req, res, cb, options) => {
  log.LOG(`Request received: ${req.method} "${req.originalUrl}"\
${Object.keys(req.body).length ? `, body=${JSON.stringify(req.body)}` : ''}`);
  res = options.paginated ? paginated(req, res, options.pageSize) : res;
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

  if (!wsbootProperties.cors) {
    log.WARNING(`WSBoot configuration "cors" not provided. Using default value "${JSON.stringify(SYSTEM_DEFAULT.cors)}".`);
  } else {
    log.LOG(`Using WSBoot "cors" configuration: ${JSON.stringify(wsbootProperties.cors)}`);
  }
  app.use(cors(wsbootProperties.cors || SYSTEM_DEFAULT.cors));

  app.listen(wsbootProperties.port || SYSTEM_DEFAULT.port);
  log.LOG(`WSBoot web server successfully started. Listening on port ${wsbootProperties.port || SYSTEM_DEFAULT.port}`);
};

function all(route) {
  if (typeof arguments[1] === 'object') {
    log.LOG(`Mapped route: method="ALL", route="${route}", configuration="${JSON.stringify(arguments[1])}"`);
    app.all(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[2], {
      ...DEFAULT_OPTIONS,
      ...arguments[1],
    }));
  } else {
    app.all(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[1], DEFAULT_OPTIONS));
    log.LOG(`Mapped route: method="ALL", route="${route}", configuration=default`);
  }
};

function httpDelete(route) {
  if (typeof arguments[1] === 'object') {
    log.LOG(`Mapped route: method="DELETE", route="${route}", configuration="${JSON.stringify(arguments[1])}"`);
    app.delete(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[2], {
      ...DEFAULT_OPTIONS,
      ...arguments[1],
    }));
  } else {
    app.delete(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[1], DEFAULT_OPTIONS));
    log.LOG(`Mapped route: method="DELETE", route="${route}", configuration=default`);
  }
};

function get(route) {
  if (typeof arguments[1] === 'object') {
    log.LOG(`Mapped route: method="GET", route="${route}", configuration="${JSON.stringify(arguments[1])}"`);
    app.get(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[2], {
      ...DEFAULT_OPTIONS,
      ...arguments[1],
    }));
  } else {
    app.get(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[1], DEFAULT_OPTIONS));
    log.LOG(`Mapped route: method="GET", route="${route}", configuration=default`);
  }
};

function patch(route) {
  if (typeof arguments[1] === 'object') {
    log.LOG(`Mapped route: method="PATCH", route="${route}", configuration="${JSON.stringify(arguments[1])}"`);
    app.patch(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[2], {
      ...DEFAULT_OPTIONS,
      ...arguments[1],
    }));
  } else {
    app.patch(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[1], DEFAULT_OPTIONS));
    log.LOG(`Mapped route: method="PATCH", route="${route}", configuration=default`);
  }
}

function post(route) {
  if (typeof arguments[1] === 'object') {
    log.LOG(`Mapped route: method="POST", route="${route}", configuration="${JSON.stringify(arguments[1])}"`);
    app.post(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[2], {
      ...DEFAULT_OPTIONS,
      ...arguments[1],
    }));
  } else {
    app.post(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[1], DEFAULT_OPTIONS));
    log.LOG(`Mapped route: method="POST", route="${route}", configuration=default`);
  }
};

function put(route) {
  if (typeof arguments[1] === 'object') {
    log.LOG(`Mapped route: method="PUT", route="${route}", configuration="${JSON.stringify(arguments[1])}"`);
    app.put(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[2], {
      ...DEFAULT_OPTIONS,
      ...arguments[1],
    }));
  } else {
    app.put(route, (req, res) => ROUTE_CB_WRAPPER(req, res, arguments[1], DEFAULT_OPTIONS));
    log.LOG(`Mapped route: method="PUT", route="${route}", configuration=default`);
  }
};

module.exports = {
  all,
  delete: httpDelete,
  get,
  init,
  patch,
  post,
  put,
};
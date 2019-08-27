# Warning note

This library is still under development. We do **not** recommend using it yet since its features and/or interfaces might change in a nightly basis.

Also, it has not been tested properly yet. Test cases are still being designed as the library evolves, so its stability can't be guaranteed for now.

If you still want to use it, consider checking this library's behavior when debugging your project.

# About

Re-implementation of [Express.js](https://expressjs.com/) APIs, providing a simplified and further automatized usage, allowing developers to create web services much faster and with the same personalization levels.

# Setup

This library uses [@ricardofuzeto/ws-core](https://www.npmjs.com/package/@ricardofuzeto/ws-core) underneath. Because of this, it is mandatory to have a file `application.json` in your project's root, or the application will throw an error during startup.

For *ws-boot*, it is expected that such JSON file contains a `boot` property, where all *ws-boot* configuration will be. It should look like this:

```
// ...config data
  "boot": { /* ws-boot properties */ },
// ...config data
```

The following table shows all configuration fields that can be placed inside the `application.json` file and that will be recognized by *ws-boot*:

| field | type | default | description |
| ----- | :--: | :-----: | ----------- |
| port | number | 4000 | Port that Express's application will listen to |
| bodyType | string | "json" | Parser middleware type that will be applied to Express's request bodies. Accepted values: "json", "raw", "text" and "urlencoded". |
| cors | object | {} | CORS custom configuration to be applied to the Express application. For further information, see [CORS](https://www.npmjs.com/package/cors) |

# Booting the server

To boot your Express application via *ws-boot*, just add the following code:

```
const wsBoot = require('@ricardofuzeto/ws-boot');

wsBoot.init();
```

This will create an Express application, add all configurations previously defined and start it, 100% transparent to you. Also, you will see on console all configurations used to create the application.

# Routes

## Mapping new routes

To map a new route in your application, just import *ws-boot* and map directly from it:

```
wsBoot.get('/route1', (req, res) => {});
wsBoot.get('/route2', { options }, (req, res) => {});
```

This mapping augments what Express.js does, adding a log message for every mapped resource, allowing developers to know exactly what routes were mapped. Also, you can note the `options` object, which is an optional second argument. You can define custom options for a route, according to your needs. Check the section [Routes options](#routes-options) for further information.

## Supported HTTP methods

*ws-boot* does **not** support all HTTP methods. However, it does give enough support for a subset that satisfies the needs of almost all web service projects. Are the supported methods: DELETE, GET, PATCH, POST and PUT.

You can also use the ALL mapping from Express, but that is provided only for compatibility and flexibility purposes, and should be used only when absolutely no other method (even those in Express) is enough for what you need.

## Routes Options

As mentioned before, to add custom options to a route, you just have to pass an object as a second argument of the mapping function, like this:

```
wsBoot.get('/route1', { options }, (req, res) => {});
```

The `options` object currently support the following values:

| option | type | default | description |
| ----- | :--: | :-----: | ----------- |
| paginated | boolean | false | When set to `true`, the route's response will be paginated. *ws-boot* will only split returned data into pages, and handle the requested page via request's query field *page* |
| pageSize | number | 20 | Amount of results per page, when route's response is paginated |

# Contributors

Ricardo Fuzeto ([email](mailto:ricardofuzeto@gmail.com?subject=About%20ws-boot)): idea conception and initial development stages
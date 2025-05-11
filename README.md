# apichainer

<!-- [![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][github-actions-ci-image]][github-actions-ci-url]
[![Test Coverage][coveralls-image]][coveralls-url] -->

**apichainer** is a Node.js package for providing an [Express](http://expressjs.com/) middleware chaining library that supports [JSON schema validation](https://json-schema.org/), authentication, logging, [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing), and parallel execution with customizable options.

- [Installation](#installation)
- [Usage](#usage)
  - [Simple Usage (Enable Validation and CORS)](simple-usage-enable-validation-and-cors)
  - [Enable Middleware for a Single Route](#enable-middleware-for-a-single-route)
  - [Enabling Parallel Execution](#enabling-parallel-execution)
  - [Configuring Validation](#configuring-validation)
  - [Enabling Parallel Execution](#enabling-parallel-execution)
- [Configuration Options](#configuration-options)
- [Demo](#demo)
- [License](#license)

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/). Installation is done using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

````sh
$ npm install apichainer
```

## Usage

### Simple Usage (Enable Validation and CORS)

#### Chain middleware for an Express route with validation and CORS support:

```javascript
var express = require('express');
var APIChainer = require('apichainer');

var app = express();

app.use(express.json());

var chain = new APIChainer()
  .cors()
  .validate({
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
  })
  .use(function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled with validation!' });
  });

app.post('/api', function (req, res) {
  chain.execute(req, res);
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
````

### Enable Middleware for a Single Route

Apply authentication and validation to a specific route:

```javascript
var express = require('express');
var APIChainer = require('apichainer');

var app = express();

app.use(express.json());

var chain = new APIChainer()
  .auth({ token: 'secret' })
  .validate({
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
  })
  .use(function (req, res, next) {
    res.json({ msg: 'This is authenticated and validated for a single route' });
  });

app.post('/api', function (req, res) {
  chain.execute(req, res);
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
```

### Enabling Parallel Execution

Run middleware concurrently for improved performance:

```javascript
var express = require('express');
var APIChainer = require('apichainer');

var app = express();

app.use(express.json());

var chain = new APIChainer({}, true) // Enable parallel execution
  .log({ level: 'info' })
  .cors()
  .use(function (req, res, next) {
    // Simulate async task
    setTimeout(function () {
      res.json({ msg: 'Parallel execution completed' });
    }, 1000);
  });

app.get('/api', function (req, res) {
  chain.execute(req, res);
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
```

## Configuration Options

- `validate(schema)`:
  - Validates `req.body` against a JSON Schema.
  - Returns `<property> is required` for missing or invalid required properties.
  - Example: `{ type: 'object', properties: { name: { type: 'string' } }, required: ['name'] }`
- `validate(schema)`:

  - Adds token-based authentication.
  - Options:
  - Options:
  - Options:
  - `token`: Required string (e.g., `secret`).
  - `header`: Optional string (e.g., `authorization`, defaults to `authorization`).

- `auth(options)`:

  - Adds token-based authentication
  - ### Options
    - `token`: Required string (e.g., `secret`)
    - `header`: Optional string (e.g., `authorization`, default to `authorization`).

- `log(options)`:

  - Logs request details (method, URL, timestamp).
  - ### Options
    - `level`: `info`, `warn`, or `error` (default to `info`).

- `parallel`:
  - Enable parallel middleware execution by setting `parallel: true` in the constructor.
  - Example: `new APIChainer({},true)`

The default configuration is the equivalent of:

## Demo

A demo illustrating `apichainer` usage with Express is available in the repository:

```sh
$ git clone https://github.com/vivek3410/apichainer
$ cd apichainer
$ npm install
$ node examples/express-example.js
```

Test with curl:

```sh
$ curl -X POST http://localhost:3000/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer secret" \
  -d '{"name":"John"}'
```

Expected response:

```sh
 { "msg": "This is CORS-enabled with validation!" }
```

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

[downloads-image]: https://img.shields.io/npm/dm/apichainer.svg
[downloads-url]: https://npmjs.org/package/apichainer
[github-actions-ci-image]: https://img.shields.io/github/actions/workflow/status/vivek3410/apichainer/ci.yml?branch=master&label=ci
[github-actions-ci-url]: https://github.com/vivek3410/apichainer?query=workflow%3Aci
[npm-image]: https://img.shields.io/vivek3410/apichainer.svg
[npm-url]: https://npmjs.org/package/apichainer

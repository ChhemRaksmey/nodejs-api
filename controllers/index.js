/**
 * Controller auto-loader.
 * controllers/deployed/<name>.controller.js  ->  controllers[<name>]
 */
const fs = require('fs');
const path = require('path');

const SUFFIX = '.js';
const dir = path.join(__dirname, 'deployed');
const controllers = {};

fs.readdirSync(dir)
  .filter((f) => f.endsWith(SUFFIX))
  .sort()
  .forEach((file) => {
    controllers[file.slice(0, -SUFFIX.length)] = require(path.join(dir, file));
  })
;

module.exports = controllers;

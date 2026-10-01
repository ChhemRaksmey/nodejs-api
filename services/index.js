/**
 * Service auto-loader.
 * services/deployed/<name>.service.js  ->  services[<name>]
 */
const fs = require('fs');
const path = require('path');

const SUFFIX = '.js';
const dir = path.join(__dirname, 'deployed');
const services = {};

fs.readdirSync(dir)
  .filter((f) => f.endsWith(SUFFIX))
  .sort()
  .forEach((file) => {
    services[file.slice(0, -SUFFIX.length)] = require(path.join(dir, file));
  });

module.exports = services;

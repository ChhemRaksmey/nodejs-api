/**
 * Route auto-loader.
 * routes/deployed/<name>.route.js            ->  mounted at /<name>
 * routes/deployed/route<Anything>.route.js   ->  mounted at /   (full path defined inside the file)
 */
const fs = require('fs');
const path = require('path');
const express = require('express');

const SUFFIX = '.js';
const dir = path.join(__dirname, 'deployed');
const router = express.Router();

fs.readdirSync(dir)
  .filter((f) => f.endsWith(SUFFIX))
  .sort()
  .forEach((file) => {
    const key = file.slice(0, -SUFFIX.length);
    const mountPath = key.startsWith('route') ? '/' : `/${key}`;
    router.use("/", require(path.join(dir, file)));
  });

module.exports = router;

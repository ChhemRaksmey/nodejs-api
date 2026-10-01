/**
 * Model auto-loader.
 * models/deployed/<name>.model.js  ->  db[<name>]
 * Each model file exports: (sequelize, DataTypes) => Model
 */
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../configs');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: config.db.logging ? console.log : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});

const SUFFIX = '.js';
const dir = path.join(__dirname, 'deployed');
const db = {};

fs.readdirSync(dir)
  .filter((f) => f.endsWith(SUFFIX))
  .sort()
  .forEach((file) => {
    const key = file.slice(0, -SUFFIX.length);
    db[key] = require(path.join(dir, file))(sequelize, DataTypes);
  });

Object.keys(db).forEach((key) => {
  if (typeof db[key].associate === 'function') db[key].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

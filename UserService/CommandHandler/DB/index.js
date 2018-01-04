"use strict";
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = function ({ dbname, username, password, host, port, dialect, pool : { max, min, idle } }) {
  let db = {};

  const sequelize = new Sequelize(dbname, username, password, {
    host,
    dialect /** dialect mysql || postgres || mssql */,
    pool : { max, min, idle },
    logging : true
  });

  fs.readdirSync(__dirname + '/models')
    .filter( (file) => {
      return (file.indexOf(".") !== 0)
    })
    .forEach( (file) => {
      var model = sequelize.import(path.join(__dirname, '/models/', file));
      db[model.name] = model;
    });

  Object.keys(db)
    .forEach( (modelName) => {
      if("associate" in db[modelName]) {
        db[modelName].associate(db);
      }
    });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return {dbmessage : 'postgres connection established', db : db }
};

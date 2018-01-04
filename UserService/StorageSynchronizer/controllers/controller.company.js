"use strict";
const companyModel = require('../models/model.company');

module.exports = function(debug, db){
  //only receiving single single action from kafka
  return {
    createCompany : async function ({aggregateId, aggregateVersion, payload}) {
      try {
        const createByIdQuery = companyModel.createCompanyById(aggregateId, aggregateVersion, payload);
        debug(`create user:companyById:${aggregateId} with Query : %o`, createByIdQuery);
        const result = await db.multi([createByIdQuery]).exec();
        if(debug.enabled){
          db.hgetall(`user:companyById:${aggregateId}`, (err,res) => {
              debug(`fetch user:companyById:${aggregateId} %o`, res);
          });
        }
      } catch (e) {
        debug('error while creating user:company %s', e.toString());
      }
    },
    updateCompany : async function ({aggregateId, aggregateVersion, payload}) {
      try {
        const updateByIdQuery = companyModel.updateCompanyById(aggregateId, aggregateVersion, payload);
        debug(`update user:companyById:${aggregateId} with Query : %o`, updateByIdQuery);
        const result = await db.multi([updateByIdQuery]).exec();
        if(debug.enabled){
          db.hgetall(`user:companyById:${aggregateId}`, (err,res) => {
              debug(`fetch user:companyById:${aggregateId} %o`, res);
          });
        }
      } catch (e) {
        debug('error while updating user:company %s', e.toString());
      }
    },
    deleteCompany : async function ({aggregateId}) {
      try {
        const deleteByIdQuery = companyModel.deleteCompanyById(aggregateId);
        debug(`delete user:companyById:${aggregateId} with Query : %o`, deleteByIdQuery);
        const result = await db.multi([deleteByIdQuery]).exec();
        if(debug.enabled){
          db.hgetall(`user:companyById:${aggregateId}`, (err,res) => {
              debug(`fetch user:companyById:${aggregateId} %o`, res);
          });
        }
      } catch (e) {
        debug('error while updating user:company %s', e.toString());
      }
    },
  }
}

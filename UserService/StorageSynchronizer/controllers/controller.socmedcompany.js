"use strict";
const socmedcompanyModel = require('../models/model.socmedcompany');

module.exports = function(debug, db){
  //only receiving single single action from kafka
  return {
    createSocmedcompany : async function ({aggregateId, aggregateVersion, payload}) {
      try {
        const createByIdQuery = socmedcompanyModel.createSocmedcompanyById(aggregateId, aggregateVersion, payload);
        const createByCompanyQuery = socmedcompanyModel.createSocmedcompanyByCompany(aggregateId, payload.companyId);
        debug(`create user:socmedcompanyById:${aggregateId} with Query : %o`, createByIdQuery);
        debug(`create user:socmedcompanyByCompany:${payload.companyId} : %o`, createByCompanyQuery);
        const result = await db.multi([createByIdQuery, createByCompanyQuery]).exec();
        if(debug.enabled){
          db.hgetall(`user:socmedcompanyById:${aggregateId}`, (err,res) => {
              err
                ? debug('error : %s', err)
                : debug(`fetch user:socmedcompanyById:${aggregateId} %o`, res);
          });
          db.sismember(`user:socmedcompanyByCompany:${payload.companyId}`, aggregateId, (err,res) => {
              err
                ? debug('error : %s' ,err)
                : debug(`${aggregateId} has${res ? '' : ' not' } been added to user:socmedcompanyByCompany:${payload.companyId}`)
          });
        }
      } catch (e) {
        debug('error while creating user:socmedcompany %s', e.toString());
      }
    },
    updateSocmedcompany : async function ({aggregateId, aggregateVersion, payload}) {
      try {
        const updateByIdQuery = socmedcompanyModel.updateSocmedcompanyById(aggregateId, aggregateVersion, payload);
        debug(`update user:socmedcompanyById:${aggregateId} with Query : %o`, updateByIdQuery);
        const result = await db.multi([updateByIdQuery]).exec();
        if(debug.enabled){
          db.hgetall(`user:socmedcompanyById:${aggregateId}`, (err,res) => {
            err
              ? debug('error : %s' ,err)
              : debug(`fetch user:socmedcompanyById:${aggregateId} %o`, res);
          });
        }
      } catch (e) {
        debug('error while updating user:socmedcompany %s', e.toString());
      }
    },
    deleteSocmedcompany : async function ({aggregateId}) {
      try {
        const companyId = db.hget(`user:socmedcompanyById:${aggregateId}`, 'companyId', async (err, companyId) => {
          const deleteByIdQuery = socmedcompanyModel.deleteSocmedcompanyById(aggregateId);
          const deleteByCompanyQuery = socmedcompanyModel.deleteSocmedcompanyByCompany(aggregateId, companyId);
          debug(`delete user:socmedcompanyById:${aggregateId} with Query : %o`, deleteByIdQuery);
          debug(`delete user:socmedcompanyByCompany:${companyId} with Query : %o`, deleteByCompanyQuery);
          const result = await db.multi([deleteByIdQuery, deleteByCompanyQuery]).exec();
          if(debug.enabled){
            db.hgetall(`user:socmedcompanyById:${aggregateId}`, (err,res) => {
              err
                ? debug('error : %s' ,err)
                : debug(`fetch user:socmedcompanyById:${aggregateId} %o`, res);
            });
            db.sismember(`user:socmedcompanyByCompany:${companyId}`, aggregateId, (err,res) => {
              err
                ? debug('error : %s' ,err)
                : debug(`${aggregateId} has${res ? ' not' : '' } been removed from user:socmedcompanyByCompany:${companyId}`);
            });
          }
        })
      } catch (e) {
        debug('error while updating user:socmedcompany %s', e.toString());
      }
    },
  }
}

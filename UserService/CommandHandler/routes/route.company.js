"use strict";
const httpStatus = require('http-status-codes'),
      Controller = require('../controllers/controller.company');
let controller = null;

module.exports = function (debug,db) {
  controller = Controller(debug,db);
  return {
    handler : async function (sequenceId, eventType, values=null, query=null) {
      switch(eventType){
        case 'COMPANY REGISTERED' :
          return await controller.registerCompany(sequenceId, eventType, values);
          break;
        case 'COMPANY MODIFIED' :
          return await controller.modifyCompany(sequenceId, eventType, values, query);
          break;
        case 'COMPANY DEREGISTERED' :
          return await controller.unregisterCompany(sequenceId, eventType, values, query);
          break;
        default :
          return {
            httpStatus : httpStatus.BAD_REQUEST,
            response : null,
            error : new Error(`unknown event type of ${eventType}`).toString()
          }
          break;
      }
    }
  }
}

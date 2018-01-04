"use strict";
const httpStatus = require('http-status-codes'),
      Controller = require('../controllers/controller.socmedcompany');
let controller = null;

module.exports = function (debug,db) {
  controller = Controller(debug,db);
  return {
    handler : async function (sequenceId, eventType, values=null, query=null) {
      switch(eventType){
        case 'SOCMEDCOMPANY REGISTERED' :
          return await controller.registerSocmedcompany(sequenceId, eventType, values);
          break;
        case 'SOCMEDCOMPANY MODIFIED' :
          return await controller.modifySocmedcompany(sequenceId, eventType, values, query);
          break;
        case 'SOCMEDCOMPANY DEREGISTERED' :
          return await controller.unregisterSocmedcompany(sequenceId, eventType, values, query);
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

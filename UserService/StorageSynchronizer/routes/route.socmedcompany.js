"use strict";
const Controller = require('../controllers/controller.socmedcompany');
let controller = null;

module.exports = function (debug,db) {
  controller = Controller(debug,db);
  return {
    handler : async function ({ eventType, payload }) {
       switch(eventType){
        case 'SOCMEDCOMPANY REGISTERED' :
          return await controller.createSocmedcompany(payload);
          break;
        case 'SOCMEDCOMPANY MODIFIED' :
          return await controller.updateSocmedcompany(payload);
          break;
        case 'SOCMEDCOMPANY DEREGISTERED' :
          return await controller.deleteSocmedcompany(payload);
          break;
      }
    }
  }
}

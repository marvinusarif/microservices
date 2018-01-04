"use strict";
const Controller = require('../controllers/controller.company');
let controller = null;

module.exports = function (debug,db) {
  controller = Controller(debug,db);
  return {
    handler : async function ({ eventType, payload }) {
       switch(eventType){
        case 'COMPANY REGISTERED' :
          return await controller.createCompany(payload);
          break;
        case 'COMPANY MODIFIED' :
          return await controller.updateCompany(payload);
          break;
        case 'COMPANY DEREGISTERED' :
          return await controller.deleteCompany(payload);
          break;
      }
    }
  }
}

"use strict";
const socmedcompanyModel = require('../models/model.socmedcompany');

module.exports = function(debug, db) {
  return {
    fetchSocmedcompanyById: async function(call, callback) {
      try {
        const result = await socmedcompanyModel.getSocmedcompanyById(db, call.request.socmedcompanyId);
        debug(`fetch user:socmedcompanyById:${call.request.socmedcompanyId}, %o`, result);
        callback(null, result)
      } catch (e) {
        callback(e, null);
      }
    },
    fetchSocmedcompanyByCompany : async function (call, callback) {
      try {
        const result = await socmedcompanyModel.getSocmedcompanyByCompany(db, call.request.companyId);
        debug(`fetch user:socmedcompanyByCompany:${call.request.companyId}, %o`, result);
        callback(null, result)
      } catch (e) {
        callback(e, null);
      }
    },
    fetchSocmedcompanyVersion : async function (call,callback) {
      try {
        const result = await socmedcompanyModel.getSocmedcompanyVersion(db, call.request.socmedcompanyId);
        debug(`fetch version of user:socmedcompanyById:${call.request.socmedcompanyId} %o`, result);
        callback(null, {"version" : result ? result : "" })
      } catch (e) {
        callback(e,null);
      }
    }
  }
}

"use strict";
const companyModel = require('../models/model.company');

module.exports = function(debug, db) {
  return {
    fetchCompanyById: async function(call, callback) {
      try {
        const result = await companyModel.getCompanyById(db, call.request.companyId);
        debug(`fetch user:companyById:${call.request.companyId}, %o`, result);
        callback(null, result)
      } catch (e) {
        callback(e, null);
      }
    },
    fetchCompanyVersion : async function (call,callback) {
      try {
        const result = await companyModel.getCompanyVersion(db, call.request.companyId);
        debug(`fetch version of user:companyById:${call.request.companyId} %o`, result);
        callback(null, { "version" : result ? result : "" })
      } catch (e) {
        callback(e,null);
      }
    }
  }
}

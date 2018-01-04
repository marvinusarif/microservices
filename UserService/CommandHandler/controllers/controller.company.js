"use strict";
const httpStatus = require('http-status-codes');
const companyModel = require('../models/model.company');

module.exports = function (debug, db) {
  return {
    registerCompany : async function (sequenceId, eventType, value) {
      let response = null,
          error = null;
      try {
        debug('register company %o', value);
        response = await companyModel.create(db, sequenceId, eventType, value);
      } catch (e) {
        debug('error while registering company %s',e.toString());
        error = e.toString();
      }
      return {
        httpStatus : !error ? httpStatus.CREATED : httpStatus.BAD_REQUEST,
        response,
        error
      }
    },

    modifyCompany : async function (sequenceId, eventType, value, query) {
      let response = null,
          error = null;
      try {
        debug('update company %o', value);
        response = await companyModel.update(db, sequenceId, eventType, value, query);
      } catch (e) {
        debug('error while updating company %s', e.toString());
        error = e.toString();
      }
      return {
        httpStatus : !error ? httpStatus.OK : httpStatus.BAD_REQUEST,
        response,
        error
      }
    },

    unregisterCompany : async function(sequenceId, eventType, value, query) {
      let response = null,
      error = null;
      try {
        debug('delete company %o', value);
        response = await companyModel.delete(db, sequenceId, eventType, value, query);
      } catch (e) {
        debug('error while deleting company %s', e.toString());
        error = e.toString();
      }
      return {
        httpStatus : !error ? httpStatus.OK : httpStatus.BAD_REQUEST,
        response,
        error
      }
    }
  }
}

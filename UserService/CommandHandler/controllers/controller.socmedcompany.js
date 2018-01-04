"use strict";
const httpStatus = require('http-status-codes');
const socmedcompanyModel = require('../models/model.socmedcompany');

module.exports = function (debug, db) {
  return {
    registerSocmedcompany : async function (sequenceId, eventType, value) {
      let response = null,
          error = null;
      try {
        debug('register socmedcompany %o', value);
        response = await socmedcompanyModel.create(db, sequenceId, eventType, value);
      } catch (e) {
        debug('error while registering socmedcompany %s',e.toString());
        error = e.toString();
      }
      return {
        httpStatus : !error ? httpStatus.CREATED : httpStatus.BAD_REQUEST,
        response,
        error
      }
    },

    modifySocmedcompany : async function (sequenceId, eventType, value, query) {
      let response = null,
          error = null;
      try {
        debug('update socmedcompany %o', value);
        response = await socmedcompanyModel.update(db, sequenceId, eventType, value, query);
      } catch (e) {
        debug('error while updating socmedcompany %s', e.toString());
        error = e.toString();
      }
      return {
        httpStatus : !error ? httpStatus.OK : httpStatus.BAD_REQUEST,
        response,
        error
      }
    },

    unregisterSocmedcompany : async function(sequenceId, eventType, value, query) {
      let response = null,
      error = null;
      try {
        debug('delete socmedcompany %o', value);
        response = await socmedcompanyModel.delete(db, sequenceId, eventType, value, query);
      } catch (e) {
        debug('error while deleting socmedcompany %s', e.toString());
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

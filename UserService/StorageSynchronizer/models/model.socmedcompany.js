"use strict";
const _ = require('lodash');

exports.createSocmedcompanyById = (socmedcompanyId, version, payload) => {
  const queries = _.reduce(payload, (queries, val, key) => {
    return queries.concat(key, val);
  },['hmset',`user:socmedcompanyById:${socmedcompanyId}`, 'socmedcompanyId', socmedcompanyId, 'version', version]);
  return queries;
}

exports.createSocmedcompanyByCompany = (socmedCompanyId, companyId) => {
  // no needs the payload to normalize the schema
  return ['sadd', `user:socmedcompanyByCompany:${companyId}`, socmedCompanyId]
}

exports.updateSocmedcompanyById = (socmedcompanyId, version, payload) => {
  const queries = _.reduce(payload, (queries, val, key) => {
    return queries.concat(key,val);
  },['hmset', `user:socmedcompanyById:${socmedcompanyId}`, 'version', version]);
  return queries;
}

exports.deleteSocmedcompanyById = (socmedcompanyId) => {
  const queries = ['del', `user:socmedcompanyById:${socmedcompanyId}`];
  return queries;
}

exports.deleteSocmedcompanyByCompany = (socmedcompanyId, companyId) => {
  const queries = ['srem', `user:socmedcompanyByCompany:${companyId}`, socmedcompanyId];
  return queries;
}

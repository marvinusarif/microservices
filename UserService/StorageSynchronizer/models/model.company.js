"use strict";
const _ = require('lodash');

exports.createCompanyById = (companyId, version, payload) => {
  const queries = _.reduce(payload, (queries, val, key) => {
    return queries.concat(key, val);
  },['hmset',`user:companyById:${companyId}`, 'companyId', companyId, 'version', version]);
  return queries;
}

exports.updateCompanyById = (companyId, version, payload) => {
  const queries = _.reduce(payload, (queries, val, key) => {
    return queries.concat(key,val);
  },['hmset', `user:companyById:${companyId}`, 'version', version]);
  return queries;
}

exports.deleteCompanyById = (companyId) => {
  const queries = ['del', `user:companyById:${companyId}`];
  return queries;
}

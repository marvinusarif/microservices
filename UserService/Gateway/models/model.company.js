"use strict";
const { sendRPC } = require('./model.rpc.js');

exports.registerCompany = async (req, sequenceId, values = {}) => {
  if(sequenceId && Object.keys(values).length > 0 ){
    return sendRPC(req,'COMPANY REGISTERED',{ sequenceId, values });
  } else {
    throw new Error('insert query should have values')
  }
}

exports.modifyCompany = async (req, sequenceId, values = {}, query = {}) => {
  if(sequenceId && Object.keys(values).length > 0 && Object.keys(query).length > 0){
    return sendRPC(req,'COMPANY MODIFIED',{ sequenceId, values, query });
  } else {
    throw new Error('update query should have value and where clause ')
  }
}

exports.unregisterCompany = async(req, sequenceId, values={}, query = {}) => {
  if(sequenceId && Object.keys(query).length > 0) {
    return sendRPC(req,'COMPANY DEREGISTERED', { sequenceId, values, query });
  } else {
    throw new Error('unregister query should have where clause');
  }
}

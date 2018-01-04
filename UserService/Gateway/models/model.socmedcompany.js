"use strict";
const { sendRPC } = require('./model.rpc.js');

exports.registerSocmedcompany = async (req, sequenceId, values = {}) => {
  if(sequenceId && Object.keys(values).length > 0 ){
    return sendRPC(req,'SOCMEDCOMPANY REGISTERED',{ sequenceId, values });
  } else {
    throw new Error('insert query should have values')
  }
}

exports.modifySocmedcompany = async (req, sequenceId, values = {}, query = {}) => {
  if(sequenceId && Object.keys(values).length > 0 && Object.keys(query).length > 0){
    return sendRPC(req,'SOCMEDCOMPANY MODIFIED',{ sequenceId, values, query });
  } else {
    throw new Error('update query should have value and where clause ')
  }
}

exports.unregisterSocmedcompany = async(req, sequenceId, values={}, query = {}) => {
  if(sequenceId && Object.keys(query).length > 0) {
    return sendRPC(req,'SOCMEDCOMPANY DEREGISTERED', { sequenceId, values, query });
  } else {
    throw new Error('unregister query should have where clause');
  }
}

"use strict";
const HTTPSTATUS = require('http-status-codes');

exports.sendRPC = async (req, eventType, payload) => {
  const conf = {
    queueName : 'USER_CMDHANDLER_V1.0',
    noAck : false,
    reply_timeout : 2000,
    process_timeout : 3000
  }
  const headerOptions = {
    appId : 'USER_GATEWAY_01',
    type : eventType,
    contentType : 'application/json',
    contentEncoding : 'utf-8',
  }
  try {
    const rpcResponse = await req.app.get('amqp').sendRPCQueue(conf,
    req.app.get('amqp.ch'),
    JSON.stringify(payload),
    headerOptions);

    const { httpStatus, response, error } = JSON.parse(rpcResponse.content.toString());
    return {
      httpStatus : httpStatus,
      response : response,
      error : error
    }
  } catch (e) {
    //catch timeout error,
    return {
      httpStatus : HTTPSTATUS.BAD_REQUEST,
      response : null,
      error : e.toString()
    }
  }
}

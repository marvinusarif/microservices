const amqp = require('amqplib/callback_api');
const uuid = require('uuid/v4');
const { DEFAULT } = require('./const');
let debug = null;

const amqpCreateConnection = ({host, port, username, password}) => {
  let uri;
  return new Promise( (resolve,reject) => {
    if(username !== "" || password !==  "" ) {
      uri = `amqp://${username}:${password}@${host}:${port}`
    } else {
      uri = `amqp://${host}:${port}`
    }
    amqp.connect(uri, (err,conn) => {
      if(err){
        debug('amqp connection error %s', err);
        reject(err);
      }
      debug('amqp connection established')
      resolve(conn);
    })
  })
}

const amqpCreateChannel = (conn, name='') => {
  return new Promise( (resolve, reject) => {
    conn.createConfirmChannel( (err,ch) => {
      if(err) {
        debug('amqp channel creation error %s', err);
        reject(err);
      }
      debug('amqp channel "%s" created', name)
      resolve(ch);
    })
  })
}

const amqpStart = async (_debug, conf) => {
  try {
    debug = _debug;
    const amqpConn = await amqpCreateConnection(conf);
    return {
      receive : await amqpCreateChannel(amqpConn, 'receive'),
      send : await amqpCreateChannel(amqpConn, 'send')
    }
  } catch(e) {
    debug('error %o', e)
  }
}

const sendRPCQueue = (conf,chan,payload,headerOptions) => {
  const { queueName, noAck, reply_timeout, process_timeout } = conf;
  const { clusterId, appId, userId, type, contentType, contentEncoding, messageId, headers } = headerOptions
  return new Promise( (resolve, reject) => {
    chan.receive.assertQueue('', {exclusive : true}, (err,q) => {
      const correlationId = uuid();
      //consume respond queue
      chan.receive.consume(q.queue, (msg) => {
        if (msg.properties.correlationId === correlationId ){
          debug('received queue reply %s correlationId: %s', queueName, correlationId);
          debug('received message content %o', msg.content.toString())
          resolve(msg);
          setTimeout(function() {
            reject(new Error('reply timeout from RPC'))
          }, reply_timeout ? reply_timeout : DEFAULT.REPLY_TIMEOUT)
        }
      }, { noAck : noAck ? noAck : DEFAULT.NOACK});

      setTimeout(function() {
        reject(new Error('process timeout from RPC'))
      }, process_timeout ? process_timeout : DEFAULT.PROCESS_TIMEOUT);

      //send queue
      debug(`send queue %s correlationId: %s`, queueName, correlationId);
      debug('send message content %o', payload)
      chan.send.sendToQueue(queueName, new Buffer(payload), {
        persistent : false,
        expiration : DEFAULT.EXPIRATION.toString(),
        //ignored by RabbitMQ but useful for applications
        contentType : contentType ? contentType : undefined,
        contentEncoding : contentEncoding ? contentEncoding : undefined,
        headers : headers ? headers : {},
        correlationId : correlationId ? correlationId : undefined,
        replyTo : q.queue,
        messageId : messageId ? messageId : undefined,
        timestamp : Date.now(),
        type,
        appId : appId ? appId : undefined,
        clusterId : clusterId ? clusterId : undefined
      });
    });
  });
}

module.exports = {
  amqp,
  amqpStart,
  sendRPCQueue
}

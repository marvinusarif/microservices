const APPNAME = 'USER_CMDHANDLER_V1.0';
const httpStatus = require('http-status-codes'),
      debug = require('debug')(APPNAME),
      kafka = require('kafka-custom'),
      amqp = require('amqp-custom'),
      env = require('dotenv').config(),
      path = require('path'),
      config =  require(path.join(__dirname,'config','config.json'))[process.env.NODE_ENV_USER_CMDHANDLER || 'development'],
      postgres = require('./DB');

const startCmdHandler = async ({amqp_conf, db_conf, kafka_conf}) => {
  try {
    debug(`configuration :`);
    debug(` amqp : %o`, amqp_conf);
    debug(` kafka : %o`, kafka_conf);
    debug(` postgres : %o`, db_conf.postgres);
    //load db config | postgres
    const {dbmessage, db} = await postgres(db_conf.postgres);
    debug(dbmessage);
    /*
    * kafka client configuration do not change any code below
    */
    const userTopic = 'USER',
          kafkaProducer = kafka.startHighLevelProducer(debug, kafka_conf, APPNAME, [userTopic]);
    /**
    * load router / controller
    **/
    const companyRouter = require('./routes/route.company')(debug, db);
    const socmedcompanyRouter = require('./routes/route.socmedcompany')(debug,db);

    //implementing different channel to receive and send
    const amqpChan = await amqp.amqpStart(debug,amqp_conf);

    //start listening
    const q = APPNAME;
    debug(`start listening to queue ${q}`);
    //please use app version to determine which apps should be responsible process the queue

    amqpChan.receive.assertQueue(q, {durable : true});
    amqpChan.receive.prefetch(1)
    amqpChan.receive.consume(q, async (msg) => {
      const content = JSON.parse(msg.content.toString()),
            eventType = msg.properties.type,
            entityType = msg.properties.type.split(' ')[0];
      let   sequenceId = content.sequenceId,
            values = typeof content.values === 'string' && content.values.length > 0 ? JSON.parse(content.values) : content.values,
            query = typeof content.query === 'string' && content.query.length > 0 ? JSON.parse(content.query) : content.query,
            response = {};
      switch(entityType) {
        /**
        * code editing start here *
        **/
        case 'COMPANY' :
          response = await companyRouter.handler(sequenceId, eventType, values, query);
          break;
        case 'SOCMEDCOMPANY' :
          response = await socmedcompanyRouter.handler(sequenceId, eventType, values, query);
          break;
        /**
        * code editing end here
        **/
        default :
          response = {
            httpStatus : httpStatus.BAD_REQUEST,
            response : null,
            error : new Error(`unknown entity type of ${entityType}`).toString()
          }
          break;
      }
      /*
      * no need to change the code below
      */
      //must send ack within the same channel it receives
      amqpChan.receive.ack(msg);
      //use another channel to send queue to prevent bottleneck
      amqpChan.send.sendToQueue(msg.properties.replyTo,
      new Buffer(JSON.stringify(response)),
      {
        expiration : (10000).toString(),
        //ignored by RabbitMQ but useful for applications
        correlationId : msg.properties.correlationId,
        contentType : 'application/json',
        contentEncoding : 'utf-8',
        timestamp : Date.now(),
        type : `RESPOND_${msg.properties.type}`,
        appId : APPNAME //index should be replaced using NODE_INSTANCE while used in production (PM2)
      });

      //send event to kafka
      if(!response.error && response.response){
        let messages = null,
            kafkaPartition = 2,
            kafkaPayload = [],
            kafkaPayloadLimit = 5,
            kafkaPayloadIsArray = false;
        if(Array.isArray(response.response.get())){
            kafkaPayloadIsArray = true;
            payloadLength = payload.length;
        } else {
            payloadLength = 1;
        }
        for( let i=0; i<payloadLength/kafkaPayloadLimit; i++){
          messages = {
            eventType : eventType,
            payload : kafkaPayloadIsArray ? response.response.splice(0,kafkaPayloadLimit) : response.response.get(),
            appVersion : APPNAME,
            createdAt : msg.properties.timestamp // get from queue/ aggregates timestamp timestamp
          }
          debug(`kafka message index %i | ${messages.eventType} : %o`, i,  messages);
          kafkaPayload.push({
            topic : userTopic,
            messages : new Buffer(JSON.stringify(messages)),
            attributes : 1 //gzip compression
          });
        }
        kafkaProducer.send(kafkaPayload, () => {
          debug(`send topic : ${userTopic}, #partition : ${kafkaPartition}, #payload : ${payloadLength}, #message : ${kafkaPayload.length}.`);
        });
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

debug('booting %o', APPNAME )
startCmdHandler(config);

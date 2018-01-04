"use strict";
const APPNAME = 'USER_S5ES10R_V1.0';
const debug = require('debug')(APPNAME),
      env = require('dotenv').config(),
      path = require("path"),
      config = require(path.join(__dirname,'config','config.json'))[process.env.NODE_ENV_USER_STORAGESYNCHRONIZER || 'development'],
      kafka = require('kafka-custom'),
      redis = require('./DB');

const startStorageSynchronizer = async ({db_conf, kafka_conf}) => {
  try {
    debug(`configuration :`);
    debug(` kafka : %o`, kafka_conf);
    debug(` redis : %o`, db_conf.redis);

    //load db config redis
    const {dbmessage, db} = await redis(db_conf.redis);
    debug(dbmessage);

    /**
    * load router/ controllers
    **/
    const companyRouter = require('./routes/route.company')(debug,db);
    const socmedcompanyRouter = require('./routes/route.socmedcompany')(debug,db);
    /*
    * kafka client configuration do not change any code below
    */
    const kafkaTopics = [ 'USER' ];
    const groupId = 'USERSTORAGESYNCHRONIZER';
    const options = {};
    const kafkaConsumerGroup = kafka.startConsumerGroup(debug, kafka_conf,APPNAME,kafkaTopics,groupId);
    /*
    * end of kafka client configuration
    */
    kafkaConsumerGroup.on("message", async (msg) => {
      const message = new Buffer(msg.value, "binary"),
            parsedMessage  = JSON.parse(message.toString()),
            entityType =  parsedMessage.eventType.split(' ')[0];
      let response = null;
      switch (entityType) {
        /**
        * code editing start here *
        **/
        case 'COMPANY' :
          response = await companyRouter.handler(parsedMessage);
          break;
        case 'SOCMEDCOMPANY' :
          response = await socmedcompanyRouter.handler(parsedMessage);
          break;
        /**
        * code editing end here
        **/
      }
    });
  } catch (e) {
    debug(e);
    process.exit(1);
  }
}

debug('booting %o', APPNAME );
startStorageSynchronizer(config);

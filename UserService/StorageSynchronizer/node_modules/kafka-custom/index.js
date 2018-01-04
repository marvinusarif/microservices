const Kafka = require('kafka-node');

const startHighLevelProducer = (debug, conf, appname, kafkaTopics) => {
  const kafkaClient = new Kafka.Client(`${conf.host}:${conf.port}`,appname);
  const kafkaProducer = new Kafka.HighLevelProducer(kafkaClient,{
          partitionerType : conf.partitionerType || 2
        });

  kafkaProducer.on("ready", () => {
    debug('kafka connection established');
    kafkaClient.refreshMetadata(kafkaTopics, err => {
      if(err) {
        debug('kafka error %s', err);
      } else {
        debug('kafka refresh meta data');
      }
    });
  });

  kafkaProducer.on("error", err => {
    debug(err);
    process.exit(1)
  });

  return kafkaProducer
}

const startConsumerGroup = (debug, conf, appname, kafkaTopics, groupId, options={}) => {
  const randId = Math.floor(Math.random() * 1000);
  const kafkaOptions = Object.assign({
    host : `${conf.host}:${conf.port}`,
    groupId : groupId,
    id : `${appname}_${randId}`,
    sessionTimeout : 15000,
    protocol : ['roundrobin'],
    fromOffset : 'latest'
  }, options);

  const kafkaConsumerGroup = new Kafka.ConsumerGroup(kafkaOptions,kafkaTopics);

  kafkaConsumerGroup.on("connect", () => {
    debug('kafka connection established with options %o', kafkaOptions);
    debug('kafka start listen to topics : %o', kafkaTopics);
  });

  kafkaConsumerGroup.on("error", err => {
    debug('kafka error : %s ',err.toString());
  });

  kafkaConsumerGroup.on("SIGINT", () => {
    kafkaConsumerGroup.close(true, () => {
      process.exit();
    });
  });

  return kafkaConsumerGroup
}
module.exports = {
    startHighLevelProducer,
    startConsumerGroup
}

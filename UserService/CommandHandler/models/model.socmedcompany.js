exports.create = function({ sequelize, aggregates, events }, sequenceId, aggregateName, values) {
  const {
    companyId,
    socmed,
    value,
    actorId,
    actorIpAddr } = values;
  return sequelize.transaction((t) => {
    return aggregates.create({
      aggregateType: 'SOCMEDCOMPANY',
      aggregateVersion: 0
    }, {transaction: t}).then((aggregate) => {
      return events.create({
        aggregateId: aggregate.getDataValue('aggregateId'),
        aggregateName : aggregateName,
        aggregateVersion: 0,
        sequenceId : sequenceId,
        payload: {
          companyId,
          socmed,
          value },
        actorId: actorId,
        actorIpAddr: actorIpAddr });
    });
  });
}

exports.update = function({sequelize, aggregates,events}, sequenceId, aggregateName, values, {socmedcompanyId, version}) {
  const {
    companyId,
    socmed,
    value,
    actorId,
    actorIpAddr } = values;
  return aggregates.findOne({
    where : {
      aggregateType : 'SOCMEDCOMPANY',
      aggregateId : socmedcompanyId,
      aggregateVersion : version,
      deletedAt : null
    }
  }).then(( aggregate ) => {
    if(aggregate){
      return sequelize.transaction( (t) => {
        return events.create({
        aggregateId : aggregate.getDataValue('aggregateId'),
        aggregateName : aggregateName,
        aggregateVersion : aggregate.getDataValue('aggregateVersion') + 1,
        sequenceId : sequenceId,
        payload : {
          socmed,
          value,
          },
        actorId : actorId,
        actorIpAddr : actorIpAddr
      }, {transaction : t}).then( (event) => {
          return aggregate.updateAttributes({
            aggregateId : aggregate.getDataValue('aggregateId'),
            aggregateVersion : event.getDataValue('aggregateVersion')
          }, { transaction : t}).then( () => {
            return event;
          });
        });
      });
    } else {
      throw new Error('record does not exist')
    }
  });
}

exports.delete = function({ sequelize, aggregates, events}, sequenceId, aggregateName, values, {socmedcompanyId, version} ) {
  const { actorId, actorIpAddr } = values;
  return aggregates.findOne({
    where : {
      aggregateType : 'SOCMEDCOMPANY',
      aggregateId : socmedcompanyId,
      aggregateVersion : version,
      deletedAt : null,
    }
  }).then( (aggregate) => {
    if(aggregate){
      return sequelize.transaction((t) => {
        return events.create({
          aggregateId : aggregate.getDataValue('aggregateId'),
          aggregateName : aggregateName,
          aggregateVersion : aggregate.getDataValue('aggregateVersion') + 1,
          payload : null,
          sequenceId : sequenceId,
          actorId : actorId,
          actorIpAddr : actorIpAddr
        }, { transaction : t}).then( (event) => {
          return aggregate.updateAttributes({
            aggregateId : aggregate.getDataValue('aggregateId'),
            aggregateVersion : event.getDataValue('aggregateVersion'),
            deletedAt : sequelize.fn('NOW')
          }, { transaction : t}).then( () => {
            return event;
          });
        });
      });
    } else {
      throw new Error('record does not exist')
    }
  });
}

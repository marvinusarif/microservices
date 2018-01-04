exports.create = function({ sequelize, aggregates, events }, sequenceId, aggregateName, values) {
  const {
    name,
    industry,
    sector,
    email,
    bio,
    logo,
    startDate,
    websiteUrl,
    address,
    city,
    state,
    zipcode,
    country,
    statusId,
    actorId,
    actorIpAddr } = values;
  return sequelize.transaction((t) => {
    return aggregates.create({
      //aggregateId: '173f0188-b5c8-4efb-a896-ac972c380769',
      aggregateType: 'COMPANY',
      aggregateVersion: 0
    }, {transaction: t}).then((aggregate) => {
      return events.create({
        aggregateId: aggregate.getDataValue('aggregateId'),
        aggregateName : aggregateName,
        aggregateVersion: 0,
        sequenceId : sequenceId,
        payload: {
          name,
          industry,
          sector,
          email,
          bio,
          logo,
          startDate,
          websiteUrl,
          address,
          city,
          state,
          zipcode,
          country,
          statusId },
        actorId: actorId,
        actorIpAddr: actorIpAddr });
    });
  });
}

exports.update = function({sequelize, aggregates,events}, sequenceId, aggregateName, values, {companyId, version}) {
  const { name,
    industry,
    sector,
    email,
    bio,
    logo,
    websiteUrl,
    address,
    city,
    state,
    zipcode,
    country,
    statusId,
    actorId,
    actorIpAddr } = values;
  return aggregates.findOne({
    where : {
      aggregateType : 'COMPANY',
      aggregateId : companyId,
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
          name,
          industry,
          sector,
          email,
          bio,
          logo,
          websiteUrl,
          address,
          city,
          state,
          zipcode,
          country,
          statusId},
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

exports.delete = function({ sequelize, aggregates, events}, sequenceId, aggregateName, values, {companyId, version} ) {
  const { actorId, actorIpAddr } = values;
  return aggregates.findOne({
    where : {
      aggregateType : 'COMPANY',
      aggregateId : companyId,
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

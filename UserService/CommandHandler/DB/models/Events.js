module.exports = function(sequelize, Sequelize) {
  var events = sequelize.define('events', {
    eventId: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT()
    },
    aggregateId : {
      type : Sequelize.BIGINT(),
      allowNull : false
    },
    aggregateName : {
      type : Sequelize.STRING,
      allowNull : false
    },
    aggregateVersion : {
      type : Sequelize.INTEGER,
      allowNull : false
    },
    sequenceId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    payload : {
      type : Sequelize.JSON
    },
    actorId : {
      type : Sequelize.INTEGER,
      allowNull : true
    },
    actorIpAddr : {
      type : Sequelize.STRING(45),
      allowNull : false
    },
    deletedAt : {
      type : Sequelize.DATE,
      allowNull : true,
      default : function(){
        return null
      }
    }
  }, {
      timestamps : true,
      underscored : false,
      freezeTableName : true, //do not pluralizing tables name
      tableName : 'events'
  });

  events.sync()
    .then( () => {
    })
    .catch( () => {
      console.error('defined field in EVENTS does not match with existing table EVENTS');
      process.exit(1)
    });

  return events;
}

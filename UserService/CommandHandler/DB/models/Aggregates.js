const uuid = require('uuid/v4');

module.exports = function(sequelize, Sequelize) {
  var aggregates = sequelize.define('aggregates', {
    aggregateId: {
      primaryKey: true,
      type: Sequelize.BIGINT(),
      autoIncrement : true,
      unique : true
    },
    aggregateType : {
      type : Sequelize.STRING,
      allowNull : false
    },
    aggregateVersion : {
      type : Sequelize.INTEGER,
      allowNull : false
    },
    deletedAt : {
      type : Sequelize.DATE,
      allowNull:true,
      defaultValue : function(){
        return null
      }
    }
  }, {
      timestamps : true,
      underscored : false,
      freezeTableName : true, //do not pluralizing tables name
      tableName : 'aggregates'
  });

  aggregates.sync()
    .then( () => {
    })
    .catch( () => {
      console.error('defined field in AGGREGATES does not match with existing table AGGREGATES');
      process.exit(1)
    });

  return aggregates;
}

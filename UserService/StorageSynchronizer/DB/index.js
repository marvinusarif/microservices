"use strict";
const Redis = require('ioredis');

module.exports = function({ port, host }) {
  return new Promise( (resolve,reject) => {
    const redis = new Redis({
      host,
      port,
      clusterRetryStrategy : function (times) {
        var delay = Math.min(100 + times * 2, 2000);
        return delay;
      }
    });
    if(redis) {
      resolve ({dbmessage : 'redis connection established' , db : redis});
    } else {
      reject (new Error('redis connection failed'));
    }
  })
}

/***

Redis DB USER:
  @@@ format : DBNAME:TABLENAME:KEY eg. user:company:companyId => DBNAME : user, TABLENAME: company, KEY: companyId

  table :
  - entity company :
    variants :
      a. by companyId => user:company:companyId {hash}

  - entity user :
      variants :
        a. by userId => user:user:userId {hash}
        b. by companyId => user:userByCompany:companyId {set}

  - entity address :
      variants :
        a. by addressId => user:address:addressId {hash}
        b. by companyId => user:addressByCompany:companyId {set}
        c. by userId => user:addressByUser:userId {set}

  - entity contact :
      variants :
        a. by contactId => user:contact:contactId {hash}
        b. by companyId => user:contactByCompany:companyId {set}
        c. by userId => user:contactByUser:userId {set}

***/

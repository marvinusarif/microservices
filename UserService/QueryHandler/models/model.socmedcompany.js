exports.getSocmedcompanyById = function (db, socmedCompanyId) {
  return db.hgetall(`user:socmedcompanyById:${socmedCompanyId}`);
}

exports.getSocmedcompanyByCompany = function(db, companyId) {
  return new Promise( (resolve,reject) => {
    db.smembers(`user:socmedcompanyByCompany:${companyId}`, (err,socmedcompanyIds) => {
      const socmedcompanies = socmedcompanyIds.reduce((results, socmedcompanyId) => {
        return results.concat(db.hgetall(`user:socmedcompanyById:${socmedcompanyId}`));
      }, []);
      Promise.all(socmedcompanies).then((result) => {
        resolve(result)
      }).catch( (e) => {
        reject(e)
      });
    });
  })
}

exports.getSocmedcompanyVersion = function (db, socmedcompanyId) {
  return db.hget(`user:socmedcompanyById:${socmedcompanyId}`, 'version')
}

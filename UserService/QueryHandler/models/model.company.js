
exports.getCompanyById = function (db, companyId) {
  return db.hgetall(`user:companyById:${companyId}`);
}

exports.getCompanyVersion = function (db, companyId) {
  return db.hget(`user:companyById:${companyId}`, 'version')
}

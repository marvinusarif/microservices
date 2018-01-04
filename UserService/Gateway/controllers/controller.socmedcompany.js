"use strict";
const socmedcompanyModel = require('../models/model.socmedcompany');

const getSocmedcompanyVersion = (grpcClient, socmedcompanyId) => {
  return new Promise((resolve,reject) => {
    grpcClient.fetchSocmedcompanyVersion({ socmedcompanyId }, (err, { version }) => {
      err
        ? reject(err)
        : resolve(version)
    });
  });
}

exports.registerSocmedcompany = async (req,res) => {
  const {
      companyId,
      socmed,
      value,
    } = req.body;
  try {
    const socmedcompanyResult = await socmedcompanyModel.registerSocmedcompany(req,
      req.sequenceId,
      {
        companyId,
        socmed,
        value,
        actorIpAddr : req.header('x-forwarded-for') || req.connection.remoteAddress,
        actorId : 1 // this field should be filled with userId
    });
    res.status(socmedcompanyResult.httpStatus).send(socmedcompanyResult);
  } catch(e) {
    console.error(e);
  }
}

exports.modifySocmedcompany = async (req,res) => {
  const { socmedcompanyId } = req.params;
  const {
    socmed,
    value
    } = req.body;
  try {
    const version = await getSocmedcompanyVersion(req.app.get('grpc'),socmedcompanyId);
    const socmedcompanyResult = await socmedcompanyModel.modifySocmedcompany(req,
      req.sequenceId,
      {
        socmed,
        value,
        actorIpAddr : req.header('x-forwarded-for') || req.connection.remoteAddress,
        actorId : 1 // this field should be filled with userId
    }, {
      socmedcompanyId : socmedcompanyId,
      version : version ? version : null
    });
    res.status(socmedcompanyResult.httpStatus).send(socmedcompanyResult);
  } catch (e) {
    console.error(e);
  }
}

exports.unregisterSocmedcompany = async (req,res) => {
  const { socmedcompanyId } = req.params;
  try {
    const version = await getSocmedcompanyVersion(req.app.get('grpc'),socmedcompanyId);
    const socmedcompanyResult = await socmedcompanyModel.unregisterSocmedcompany(req,
      req.sequenceId,
    {
      actorIpAddr : req.header('x-forwarded-for') || req.connection.remoteAddress,
      actorId : 1 // this field should be filled with userId
    }, {
      socmedcompanyId : socmedcompanyId,
      version : version ? version : null,
    });
    res.status(socmedcompanyResult.httpStatus).send(socmedcompanyResult);
  } catch (e) {
    console.error(e);
  }
}

exports.getSocmedcompanyByCompany = async (req,res) => {
  req.app.get('grpc').fetchSocmedcompanyByCompany({companyId : req.params.companyId}, (err,response) => {
    if (err) console.error(err);
    res.send(response);
  })
}

exports.getSocmedcompanyById = async (req,res) => {
  req.app.get('grpc').fetchSocmedcompanyById({ socmedcompanyId : req.params.socmedcompanyId }, (err,response) => {
    if (err) console.error(err);
    res.send(response);
  })
}

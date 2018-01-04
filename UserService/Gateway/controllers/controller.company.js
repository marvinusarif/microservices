"use strict";
const companyModel = require('../models/model.company');

const getCompanyVersion = (grpcClient, companyId) => {
  return new Promise((resolve,reject) => {
    grpcClient.fetchCompanyVersion({ companyId }, (err, { version }) => {
      err
        ? reject(err)
        : resolve(version)
    });
  });
}

exports.registerCompany = async (req,res) => {
  const {
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
      statusId,
    } = req.body;
  try {
    const companyResult = await companyModel.registerCompany(req,
      req.sequenceId,
      {
        name,
        industry,
        sector,
        email,
        bio,
        logo,
        startDate : Date.now(),
        websiteUrl,
        address,
        city,
        state,
        zipcode,
        country,
        statusId,
        actorIpAddr : req.header('x-forwarded-for') || req.connection.remoteAddress,
        actorId : 1 // this field should be filled with userId
    });
    res.status(companyResult.httpStatus).send(companyResult);
  } catch(e) {
    console.error(e);
  }
}

exports.modifyCompany = async (req,res) => {
  const { companyId } = req.params;
  const {
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
    statusId, } = req.body;
  try {
    const version = await getCompanyVersion(req.app.get('grpc'), companyId);
    const companyResult = await companyModel.modifyCompany(req,
      req.sequenceId,
      {
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
        statusId,
        actorIpAddr : req.header('x-forwarded-for') || req.connection.remoteAddress,
        actorId : 1 // this field should be filled with userId
    }, {
      companyId : companyId,
      version : version ? version : null
    });
    res.status(companyResult.httpStatus).send(companyResult);
  } catch (e) {
    console.error(e);
  }
}

exports.unregisterCompany = async (req,res) => {
  const { companyId } = req.params;
  try {
    const version = await getCompanyVersion(req.app.get('grpc'), companyId);
    const companyResult = await companyModel.unregisterCompany(req,
      req.sequenceId,
    {
      actorIpAddr : req.header('x-forwarded-for') || req.connection.remoteAddress,
      actorId : 1 // this field should be filled with userId
    }, {
      companyId : companyId,
      version : version ? version : null
    });
    res.status(companyResult.httpStatus).send(companyResult);
  } catch (e) {
    console.error(e);
  }
}

exports.getCompanyById = async (req,res) => {
  req.app.get('grpc').fetchCompanyById({companyId : req.params.companyId}, (err,response) => {
    if (err) console.error(err);
    res.send(response);
  })
}

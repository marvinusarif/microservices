"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const companyController = require('../controllers/controller.company.js');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use((req,res,next) => {
  if(req.method !== 'GET') {
    req.sequenceId = req.query.sequenceId ? req.query.sequenceId : uuid();
  }
  next();
})
router.route('/')
  .post(companyController.registerCompany);

router.route('/:companyId')
  .get(companyController.getCompanyById)
  .put(companyController.modifyCompany)
  .delete(companyController.unregisterCompany);

module.exports = router;

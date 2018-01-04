"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const socmedcompanyController = require('../controllers/controller.socmedcompany.js');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use((req,res,next) => {
  if(req.method !== 'GET') {
    req.sequenceId = req.query.sequenceId ? req.query.sequenceId : uuid();
  }
  next();
});

router.route('/')
  .post(socmedcompanyController.registerSocmedcompany);

router.route('/:socmedcompanyId')
  .get(socmedcompanyController.getSocmedcompanyById)
  .put(socmedcompanyController.modifySocmedcompany)
  .delete(socmedcompanyController.unregisterSocmedcompany);

router.route('/company/:companyId')
  .get(socmedcompanyController.getSocmedcompanyByCompany);

module.exports = router;

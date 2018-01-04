"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const userControllers = require('../controllers/controller.user.js');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));
router.use((req,res,next) => {
  req.sequenceId = req.query.sequenceId ? req.query.sequenceId : uuid();
})
router.route('/ping')
  .get(userControllers.ping);

router.route('/')
  .post(userControllers.createUser);

router.route('/:userId')
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;

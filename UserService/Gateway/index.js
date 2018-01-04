"use strict";
const APPNAME = 'USER_GATEWAY_V1.0';
const debug = require('debug')(APPNAME),
      env = require('dotenv').config(),
      path = require("path"),
      config = require(path.join(__dirname,'config','config.json'))[process.env.NODE_ENV_USER_GATEWAY || 'development'],
      grpc = require('grpc'),
      amqp = require('amqp-custom'),
      bodyParser = require('body-parser'),
      app = require('express')();

const startServer = async ({ server_conf, grpc_conf, amqp_conf }) => {
  try {

    debug('configuration :');
    debug(` server : `, server_conf);
    debug(` amqp : %o`, amqp_conf);
    debug(` grpc : %o`, grpc_conf);

    const routeCompany = require('./routes/route.company');
    const routeSocmedCompany = require('./routes/route.socmedcompany');
    //declare domain service gateway routes
    app.use('/company', routeCompany);
    app.use('/socmedcompany', routeSocmedCompany);

    //Set package name based on protobuf file
    const GRPC_PACKAGE_NAME = 'UserPackage';
    const protoGRPCUser = grpc.load({ root : path.join(__dirname, '..', 'Proto'), file :'proto.user.proto' })[GRPC_PACKAGE_NAME];

    //declare middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    //connect to grpc server and amqp
    app.set('grpc', new protoGRPCUser.UserService(`${grpc_conf.host}:${grpc_conf.port}`, grpc.credentials.createInsecure()));
    //remap amqp stdlib
    app.set('amqp', amqp);
    //implement different channel for sending and receiving queue to prevent bottleneck
    app.set('amqp.ch', await amqp.amqpStart(debug, amqp_conf));

    //start listening
    app.listen(server_conf.port, (err) => {
      if(err){
        debug(err);
      } else {
        debug(`start listening at ${server_conf.port}`)
      }
    });

  } catch (e) {
    debug(e)
    process.exit(1);
  }
}
debug(`booting %o`, APPNAME)
startServer(config);

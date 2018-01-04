const APPNAME = 'USER_QHANDLER_V1.0',
      debug = require('debug')(APPNAME),
      env = require('dotenv').config(),
      path = require("path"),
      config = require(path.join(__dirname,'config','config.json'))[process.env.NODE_ENV_USER_QUERYHANDLER || 'development'],
      grpc = require('grpc'),
      redis = require('./DB');

const GRPC_PACKAGE_NAME = 'UserPackage';
const protoGRPCUser = grpc.load({ root : path.join(__dirname, '..', 'Proto'), file :'proto.user.proto' })[GRPC_PACKAGE_NAME];

const getServer = (debug,db) => {

  //load all controllers
  const companyController = require('./controllers/controller.company')(debug,db);
  const socmedcompanyController = require('./controllers/controller.socmedcompany')(debug,db);

  const server = new grpc.Server();
  const allServices = ['UserService'];
  allServices.map( (service) => {
    server.addService(protoGRPCUser[service].service, {
      //define all of your services here
      fetchCompanyById : companyController.fetchCompanyById,
      fetchCompanyVersion : companyController.fetchCompanyVersion,
      fetchSocmedcompanyById : socmedcompanyController.fetchSocmedcompanyById,
      fetchSocmedcompanyByCompany : socmedcompanyController.fetchSocmedcompanyByCompany,
      fetchSocmedcompanyVersion : socmedcompanyController.fetchSocmedcompanyVersion,
    });
  })

  return server;
}

const startGRPCServer = async ({db_conf, grpc_conf}) => {
  try {
    debug('configuration : ');
    debug(' redis : %o', db_conf.redis);
    debug(' grpc : %o', grpc_conf);

    //load db config redis
    const { dbmessage, db } = await redis(db_conf.redis);
    debug(dbmessage);


    //start grpc server
    const routeServer = getServer(debug, db);
    routeServer.bind(`${grpc_conf.host}:${grpc_conf.port}`, grpc.ServerCredentials.createInsecure());
    routeServer.start();
    debug(`GRPC Server is running on port ${grpc_conf.port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

debug('booting %o', APPNAME);
startGRPCServer(config);

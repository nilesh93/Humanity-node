const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const advertisementRoutes = require('./advertisement.routes');
const causeRoutes = require('./cause.routes');
module.exports = function (app, db) {
  userRoutes(app, db);
  causeRoutes(app, db);
  companyRoutes(app, db);
  advertisementRoutes(app, db);
};


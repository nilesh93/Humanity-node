const userRoutes = require('./user_routes');
module.exports = function(app, db) {
  userRoutes(app, db);
};

const advertiserRoutes = require('./advertiser_routes');
module.exports = function(app,db) {
  advertiserRoutes(app, db);
}

const advertisementRoutes = require('./advertisement_routes');
module.exports = function(app,db) {
  advertisementRoutes(app, db);
}

const causeRoutes = require('./cause_routes');
module.exports = function(app,db) {
  causeRoutes(app, db);
}

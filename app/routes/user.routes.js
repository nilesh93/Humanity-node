const User = require('../models/user.model');
const Donation = require('../models/donation.model');

module.exports = function (app, db) {

  // save User
  app.post('/user', (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      img: req.body.img
    });

    if (req.body.facebook)
      user.facebook = req.body.facebook;

    if (req.body.google)
      user.google = req.body.google;

    user.save((err, data) => {
      if (err)
        res.send(err);
      res.json({
        message: "User added successfully!",
        data: data,
      });
    });
  });


  // get user Details
  app.get('/user/view/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err)
        res.send(err);
      res.json(user);
    });
  });


  // get leaderboards
  app.get('/user/leaderboards', (req, res) => {
    User.find()
      .limit(10)
      .sort({ total_donations: -1 })
      .select({ name: 1, total_donations: 1 })
      .exec((err, users) => {
        if (err)
          res.send(err);
        res.json(users);
      });
  });


  // get donations
  app.get('/user/donations/:id', (req, res) => {
    Donation.find({
      _user: req.params.id
    })
      .populate('_cause')
      .sort({ date: -1 })
      .exec((err, donations) => {
        if (err)
          res.send(err);
        res.json(donations);
      });
  });
};

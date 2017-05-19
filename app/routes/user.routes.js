const User = require('../models/user.model');
const Donation = require('../models/donation.model');
const moment = require('moment');
const _ = require('lodash');
module.exports = function (app, db) {

  // save User
  app.post('/user', (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      img: req.body.img
    });

    console.log(req.body);

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

      let join_date = moment(user.join_date);
      let current = moment();

      let days = current.diff(join_date, 'days');

      // get string for date
      let date_join_string = '';
      if (days < 365) {
        date_join_string = days + ' ' + sortDays(days);
        console.log(days, date_join_string);
      } else if (parseInt(days / 365) == 1) {
        date_join_string = parseInt(days / 365) + ' Year and' + days % 365 + ' ' + sortDays(days % 365);
      } else {
        date_join_string = parseInt(days / 365) + ' Years and' + days % 365 + ' ' + sortDays(days % 365);
      }

      res.json({
        user: user,
        date_join_string: date_join_string
      });
    });


    function sortDays(days) {
      return (days == 1) ? 'Day' : 'Days';
    }
  });


  // get leaderboards
  app.get('/user/leaderboards', (req, res) => {
    User.find()
      .limit(10)
      .sort({ total_donations: -1 })
      .select({ name: 1, total_donations: 1, img: 1 })
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

  app.get('/user/rank/:id', (req, res) => {
    User.find()
      .sort({ total_donations: -1 })
      .select({ _id: 1 })
      .exec((err, users) => {
        if (err)
          res.send(err);


        let index = _.findIndex(users, (o) => o._id == req.params.id);

        res.json({
          rank: (index + 1)
        });
      });
  });
};

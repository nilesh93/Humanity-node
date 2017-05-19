
const ObjectID = require('mongodb').ObjectID;
const Cause = require('../models/cause.model');
const Donation = require('../models/donation.model');
const User = require('../models/user.model');

module.exports = function (app, db) {

  // get
  app.get('/causes', (req, res) => {
    Cause.find()
      .$where('this.recieved < this.target')
      .exec((err, causes) => {
        if (err)
          res.send(err);
        res.json({ data: causes });
      });
  });

  // view
  app.get('/causes/view/:id', (req, res) => {
    const id = req.params.id;
    Cause.findById(req.params.id)
      .exec((err, cause) => {
        if (err)
          res.send(err);
        res.json(cause);
      });
  });


  //post route
  app.post('/causes', (req, res) => {
    const cause = new Cause({
      title: req.body.title,
      description: req.body.description,
      contact: req.body.contact,
      img: req.body.img,
      target: req.body.target
    });

    cause.save((err, data) => {
      if (err)
        res.send(err);
      res.json({
        message: "Cause added successfully!",
        data: data,
      });
    });
  });


  // update causes on user donations
  app.put('/causes/donate/:id', (req, res) => {

    let cache = {};

    // update user profile
    User.findById(req.body.user_id, (err, user) => {
      if (err)
        res.send(err);

      // validate amount
      if (user.amount < req.body.amount)
        res.status(400).json({ message: "Exceeded Amount" });

      // update user points | Async  
      user.amount = user.amount - req.body.amount;
      user.total_donations += req.body.amount;
      user.save((err, data) => {
        if (err)
          res.send(err);
        cache.user = data;
        successCallback();
      });

      // add new Donation to donations collection | Async
      new Donation({
        _user: req.body.user_id,
        _cause: req.params.id,
        amount: req.body.amount,
      }).save((err, data) => {
        if (err)
          res.send(err);
        cache.donation = data;
        successCallback();
      });

      // update cause | Async
      Cause.findById(req.params.id, (err, cause) => {
        if (err)
          res.send(err);
        cause.recieved = cause.recieved + req.body.amount;
        cause.save((err, data) => {
          if (err)
            res.send(err);
          cache.cause = data;
          successCallback();
        });
      });
    });


    // success callback to check all asynchronous calls has been completed
    function successCallback() {
      if (cache.donation && cache.cause && cache.user) {
        res.json({
          message: "Donated",
          donation: cache.donation,
          cause: cache.cause,
          user: cache.user
        });
      }
    }
  });

};

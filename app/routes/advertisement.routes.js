
const ObjectID = require('mongodb').ObjectID;
const Advertisement = require('../models/advertisement.model');
const User = require('../models/user.model');
const _ = require('lodash');
const moment = require('moment');
const CONFIG = require('../../config/db');

module.exports = function (app, db) {

  // list
  // Returns only active advertisements
  app.get('/advertisements', (req, res) => {
    Advertisement.paginate({
      $where: function () {
        return ((this.views < this.max_views)
          && this._company);
      },
      expiration_date: { $gte: Date.now() }
    }, {
        populate: '_company',
        page: req.query.page || 1,
        limit: CONFIG.paginate
      }, (err, advertisements) => {
        if (err)
          res.send(err);
        res.json({ data: advertisements });
      });
  });

  // view
  app.get('/advertisements/view/:id', (req, res) => {


    Advertisement.findById(req.params.id)
      .populate('_company')
      .exec((err, advertisement) => {
        if (err)
          res.send(err);


        User.findById(req.query.user_id, (err, user) => {
          if (err)
            res.send(err);

          if (!user)
            res.status(400).json({ message: 'unauthorized user' });

          // remove expired advertisements
          user.advertisements_pending = _.reject(user.advertisements_pending, (o) => {

            let expire = moment(o.expire_date);
            let current = moment();

            return (current.diff(expire, 'seconds') > 0);
          }); // true ones will be rejected

          // check whether advertisements available
          let available_adv = _.find(user.advertisements_pending, (o) => {
            return o._advertisement == req.params.id;
          });

          console.log(available_adv);
          let avb = {};

          if (!available_adv) {
            avb.status = true;
            avb.available_in = new Date();
          } else {
            avb.status = false;
            avb.available_in = available_adv.expire_date;
          }
          res.json({ add: advertisement, availability: avb });
        });
      });
  });

  // save
  app.post('/advertisements', (req, res) => {
    const advertisement = new Advertisement({
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      expiration_date: req.body.expiration_date,
      max_views: req.body.max_views,
      price_per_view: req.body.price_per_view,
      _company: req.body._company,
      video_url: req.body.video_url
    });

    advertisement.save((err, data) => {
      if (err)
        res.send(err);
      res.json({
        message: "Advertisement added successfully!",
        data: data,
      });
    });
  });


  // update view count when a user watches an advertisemnt and update users when necessary
  app.put('/advertisements/view_count/:id', (req, res) => {
    let cache = {};
    let status = false;

    Advertisement.findById(req.params.id, (err, advertisement) => {
      if (err)
        res.send(err);

      advertisement.total_views = advertisement.total_views + 1;

      // check whether user has the correct timeout
      User.findById(req.body.id, (err, user) => {
        if (err)
          res.send(err);

        // remove expired advertisements


        user.advertisements_pending = _.reject(user.advertisements_pending, (o) => {
          console.log(o);
          let expire = moment(o.expire_date);
          let current = moment();

          return (current.diff(expire, 'seconds') > 0);
        }); // true ones will be rejected

        // check whether advertisements available
        let available_adv = _.find(user.advertisements_pending, (o) => {
          return o._advertisement == req.params.id;
        });

        if (!available_adv) {
          advertisement.views = advertisement.views + 1;
          user.points += advertisement.price_per_view;
          user.total_points += advertisement.price_per_view;
          status = true;

          // update pending advertisements for user
          user.advertisements_pending.push({
            _advertisement: req.params.id,
            expire_date: moment().add(advertisement.expiration_buffer, 'seconds').toDate()
          });
        }

        // save advertisement
        advertisement.save((err, data) => {
          if (err)
            res.send(err);
          cache.advertisement = data;
          successCallback();
        });

        // update user
        user.save((err, data) => {
          if (err)
            res.send(err);
          cache.user = data;
          successCallback();
        });
      });
    });

    function successCallback() {
      if (cache.user && cache.advertisement)
        res.json({
          message: "advertisement view Incremented and user points updated",
          advertisement: cache.advertisement,
          user: cache.user,
          status: status
        });
    }
  });

};

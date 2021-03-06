const ObjectID = require('mongodb').ObjectID;
const Cause = require('../models/cause.model');
const Donation = require('../models/donation.model');
const User = require('../models/user.model');
const _ = require('lodash');
const CONFIG = require('../../config/db');


module.exports = function (app, db) {

    // get        
    app.get('/causes', (req, res) => {



        let queryObj = {};
        queryObj.$where = 'this.recieved < this.target';
        if (req.query.filter === "Watching")
            queryObj.watched_by = req.query.user_id;
        if (req.query.search)
            queryObj.title = { $regex: new RegExp('^.*' + req.query.search + '.*', 'i') };

        Cause.paginate(queryObj, {
            limit: CONFIG.paginate,
            page: req.query.page || 1
        }, (err, causes) => {
            if (err)
                res.send(err);
            res.json({ data: causes });
        })
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
            target: req.body.target,
            state: req.body.state
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
        req.body.amount = parseFloat(req.body.amount);

        // update user profile
        User.findById(req.body.user_id, (err, user) => {
            if (err)
                res.send(err);

            // validate amount
            if (user.points < req.body.amount)
                res.status(400).json({ message: "Exceeded Amount" });

            // update user points | Async  
            user.points = user.points - req.body.amount;
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



    // watch
    app.put('/causes/watch/:cause_id', (req, res) => {
        let cause_id = req.params.cause_id;
        let user_id = req.body.user_id;

        //cause object
        Cause.findById(cause_id, (err, cause) => {
            if (err)
                res.send(err);

            if (cause.watched_by.indexOf(user_id) === -1) {
                cause.watched_by.push(user_id);
            }

            cause.save((err, data) => {
                if (err)
                    res.send(err);
                res.json({
                    message: "Success!",
                    data: data
                });
            });

        });


    });
    //unwatch
    app.put('/causes/unwatch/:id', (req, res) => {

        user_id = req.body.user_id;
        Cause.findById(req.params.id, (err, cause) => {
            if (err)
                res.send(err);
            let i = cause.watched_by.indexOf(user_id);

            if (i !== -1) {
                cause.watched_by.splice(i, 1);
            }
            cause.save((err, data) => {
                if (err)
                    res.send(err);
                res.json({
                    message: "Success!",
                    data: data
                });
            });
        });

    });



};

const Company = require('../models/company.model');
module.exports = function (app, db) {


  // list companies
  app.get('/company', (req, res) => {
    Company.find((err, company) => {
      if (err)
        res.send(err);
      res.json({ data: company });
    });
  });


  // save company
  app.post('/company', (req, res) => {

    let company = new Company({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      contact: req.body.contact,
      img: req.body.img
    });

    company.save((err, data) => {
      if (err)
        res.send(err);
      res.json({
        message: "Company added successfully!",
        data: data,
      });
    });
  });


};

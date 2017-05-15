
var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {


  //get route
  app.get('/advertisers/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('advertisers').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });


  //post route
  app.post('/advertisers', (req, res) => {
    const advertiser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      category: req.body.category,
      brand: req.body.brand,
      address: req.body.address,
      contact: req.body.contact
     };
    db.collection('advertisers').insert(advertiser, (err, result) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result.ops[0]);
    }
  });
  });

//delete route
  app.delete('/advertisers/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('advertisers').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Advertiser ' + id + ' deleted!');
      }
    });
  });

  //put (update) route
  app.put('/advertisers/:id', (req, res) => {
   const id = req.params.id;
   const details = { '_id': new ObjectID(id) };
   const advertiser = {
     name: req.body.name,
     email: req.body.email,
     password: req.body.password,
     category: req.body.category,
     brand: req.body.brand,
     address: req.body.address,
     contact: req.body.contact
   };
   db.collection('advertisers').update(details, advertiser, (err, result) => {
     if (err) {
         res.send({'error':'An error has occurred'});
     } else {
         res.send(advertiser);
     }
   });
 });



};

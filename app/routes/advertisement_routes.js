
var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {


  //get route
  app.get('/advertisements/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('advertisements').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });


  //post route
  app.post('/advertisements', (req, res) => {
    const advertisement = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      expiration_date: req.body.expiration_date,
      views: req.body.views,
      price_per_view: req.body.price_per_view
     };
    db.collection('advertisements').insert(advertisement, (err, result) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result.ops[0]);
    }
  });
  });

//delete route
  app.delete('/advertisements/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('advertisements').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Advertisement ' + id + ' deleted!');
      }
    });
  });

  //put (update) route
  app.put('/advertisements/:id', (req, res) => {
   const id = req.params.id;
   const details = { '_id': new ObjectID(id) };
   const advertisement = {
     title: req.body.title,
     description: req.body.description,
     start_date: req.body.start_date,
     expiration_date: req.body.expiration_date,
     views: req.body.views,
     price_per_view: req.body.price_per_view
   };
   db.collection('advertisements').update(details, advertisement, (err, result) => {
     if (err) {
         res.send({'error':'An error has occurred'});
     } else {
         res.send(advertisement);
     }
   });
 });



};

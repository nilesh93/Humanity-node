
var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {


  //get route
  app.get('/causes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('causes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });


  //post route
  app.post('/causes', (req, res) => {
    const cause = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      expiration_date: req.body.expiration_date,
      amount_received: req.body.amount_received,
      amount_required: req.body.amount_required
     };
    db.collection('causes').insert(cause, (err, result) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result.ops[0]);
    }
  });
  });

//delete route
  app.delete('/causes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('causes').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('Cause ' + id + ' deleted!');
      }
    });
  });

  //put (update) route
  app.put('/causes/:id', (req, res) => {
   const id = req.params.id;
   const details = { '_id': new ObjectID(id) };
   const cause = {
     title: req.body.title,
     description: req.body.description,
     start_date: req.body.start_date,
     expiration_date: req.body.expiration_date,
     amount_received: req.body.amount_received,
     amount_required: req.body.amount_required
   };
   db.collection('causes').update(details, cause, (err, result) => {
     if (err) {
         res.send({'error':'An error has occurred'});
     } else {
         res.send(cause);
     }
   });
 });



};


var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {


  //get route
  app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('users').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      }
    });
  });


  //post route
  app.post('/users', (req, res) => {
    const user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      balance: req.body.balance,
      amount_donated: req.body.amount_donated
     };
    db.collection('users').insert(user, (err, result) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(result.ops[0]);
    }
  });
  });

//delete route
  app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('users').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('User ' + id + ' deleted!');
      }
    });
  });

  //put (update) route
  app.put('/users/:id', (req, res) => {
   const id = req.params.id;
   const details = { '_id': new ObjectID(id) };
   const user = {
     first_name: req.body.first_name,
     last_name: req.body.last_name,
     email: req.body.email,
     password: req.body.password,
     balance: req.body.balance,
     amount_donated: req.body.amount_donated 
   };
   db.collection('users').update(details, user, (err, result) => {
     if (err) {
         res.send({'error':'An error has occurred'});
     } else {
         res.send(user);
     }
   });
 });



};

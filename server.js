const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const mongoose = require('mongoose');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');
var cors = require('cors');

const app = express();
const port = require('./config/db').port;

const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

// use ORM
mongoose.connect(db.url);

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./app/routes')(app, database);

    // https.createServer(httpsOptions, app).listen(port, () => {
    //     console.log('server running at ' + port)
    // });

    app.listen(port, () => {
        console.log('server running at ' + port)
    });

});
 

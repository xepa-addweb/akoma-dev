const express = require('express');
const Routes = express.Router();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var clientSchema = require('../models/client')
app.use(cors());
app.use(bodyParser.json());
console.log('sdd')
Routes.route('/clients').get(function(req, res) {
    clientSchema.find(function(err, clients) {
        if (err) {
            console.log(err);
        } else {
            res.json(clients);
        }
    });
});

Routes.route('/client/create').post(function(req, res) {
    console.log('New client')
    console.log(req.body)
    let client = new clientSchema(req.body);
    client.save()
        .then(todo => {
            res.status(200).json({'client': 'client added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new client failed');
        });
});
app.use('/', Routes);

// module.exports = app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Routes = express.Router();
var clientSchema = require('./models/client')
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/akoma', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");

})
Routes.route('/').get(async (req, res) => {
    clientSchema.find(function(err, clients) {
        if (err) {
            console.log(err);
        } else {
            console.log(clients)
            res.json(clients);
        }
    });
});
Routes.route('/create').post(async (req, res) => {
    console.log('New client')
    console.log(req.body)
    let client = new clientSchema(req.body);
    client.save()
        .then(todo => {
            res.status(200).json({'client': 'client added successfully'});
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err);
        });
});
Routes.route('/delete/:id').delete(async (req, res) => {
    console.log('New client')
    console.log(req.body)
    clientSchema.deleteOne({ _id : req.params.id})
        .then(todo => {
            clientSchema.find(function(err, clients) {
            res.status(200).json(clients);
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).send(err);
        });
});
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*'); // to enable calls from every domain 
res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // allowed actiosn
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 

if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // to deal with chrome sending an extra options request
}

next(); // call next middlewer in line
});
app.use('/clients', Routes);
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});



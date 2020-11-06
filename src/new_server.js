const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { Autohook } = require('twitter-autohook');
var rp = require('request-promise');
const socketIo = require("socket.io");
const http = require("http");
const https = require('https');
var Twit = require('twit')
const fs = require("fs")
var request = require('request')
var axios = require("axios").default;


const security = require('./security')

const Routes = express.Router();
const userRoutes = express.Router();
const settingRoutes = express.Router();
const templateRoutes = express.Router();
const roleRoutes = express.Router();
const twitterRoutes = express.Router();

var multer = require('multer')
var nodemailer = require('nodemailer');
var base64 = require('base-64');
var crypto = require('crypto')
var async = require('async')
const bcrypt = require('bcrypt');

var clientSchema = require('./models/client')
var userSchema = require('./models/userModel');
var settingSchema = require('./models/settings');
var templateSchema = require('./models/template');
var twitterSchema = require('./models/twitter');
var roleSchema = require('./models/roles')
const { Route } = require('react-router-dom');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware/auth');
const PORT = 4000;
const secret = 'mysecretsshhh';

const server = http.createServer(app);

const io = socketIo(server);
 
// verifying the connection configuration
// transporter.verify(function(error, success) {
// if (error) {
//     console.log(error);
// } else {
//     console.log("Server is ready to take our messages!");
// }
// })



(async start => {
  try {
      io.on("connection", async function(socket) {
      console.log("New client connected here");  
      console.log("try")
      const webhook = new Autohook({
        token: '1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm',
        token_secret: 'kdXIW35gxYf7si2FDd9RissqnQ0TwfAYIBMqp2f5ycwGa',
        consumer_key: 'F8xqPxo7D4A5Og4EeJyQKkY9m',
        consumer_secret: '1bSUgNNOXpsZl2EdbJcAsoaL5E15Tsje66XqgySCxHWIrpNQYs',
        env: 'develop',
        ngrok_secret: '1jS3EyYoXyVjn2vICHiwsrrjuq3_H3qr9tXavtbiTJAF6aLp',
        port: 1339
      });
  
      // Removes existing webhooks
      await webhook.removeWebhooks();
  
      // Listens to incoming activity
      webhook.on('event', event => console.log('Something happened:', event));
      
      // Starts a server and adds a new webhook
      var webhookUrl = "https://3954b9066486.ngrok.io/webhook/twitter"
      await webhook.start(webhookUrl);
      
      // Subscribes to a user's activity
      await webhook.subscribe({oauth_token: '1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm', oauth_token_secret: 'kdXIW35gxYf7si2FDd9RissqnQ0TwfAYIBMqp2f5ycwGa'});
      app.post('/webhook/twitter',async function(request, response) {

      console.log(request.body)
      if(request.body.follow_events) {
        console.log("YES___FOLLOW")
        var type = request.body.follow_events[0].type
        io.sockets.emit('follow_event', type);
      }

      if(request.body.tweet_create_events) {
        io.sockets.emit('tweet_event');
      }
      if(request.body.tweet_delete_events) {
        io.sockets.emit('tweet_event');
      }
      if(request.body.favorite_events) {
        io.sockets.emit('tweet_event')
      }
      if(request.body.direct_message_events) {
        if(request.body.direct_message_events[0].message_create.target.recipient_id === '1281552432514859008') {
          io.sockets.emit('new_direct_message', request.body)
        }
      }
      // if(request.body.direct_message_events) {
      //   console.log(request.body.direct_message_events[0].message_create)
      // }
    
    // await webhook.on('event', async event => {
    //   // Don't worry, we'll start adding something more meaningful
    //   // in just a moment.
    //   console.log('You received an event!');
    //   if (event.direct_message_events) {
    //     console.log("YES __")
    //     await sayHi(event);
    //   }
    // }); 
  
      response.send('200 OK')
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
  })
} catch(err) {
  console.log("catch")
  console.log(err)
}
})(); 

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect('mongodb://127.0.0.1:27017/akoma', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
    var roleDefaults = {}

    roleDefaults.superUserGrants = ['users:create view update',
                           'clients:create view update',
                           'mail settings:*',
                           'template:*'
                        ];
    roleDefaults.systemAdminGrants = ['users:create view update',
                            'clients:create view update',
                            'mail settings:*',
                            'template:*'
                        ];                    
    roleDefaults.systemUserGrants = ['users:view',
                            'clients:view',
                            'mail settings:view',
                            'template:view'
                        ];   
    roleDefaults.clientAdminGrants = ['users:create view update',
                            'clients:create view update',
                            'mail settings:*',
                            'template:*'
                        ];
    roleDefaults.agentGrants = [];                       

  async.series(
    [
      function (done) {
        roleSchema.findOne({name : 'Super User'}, function (err, role) {
          if (err) return done(err)
          if (role) return done()

          roleSchema.create(
            {
              name: 'Super User',
              description: 'Default role for Super User',
              grants: roleDefaults.superUserGrants
            },
            done
          )
        })
      },
      function (done) {
        roleSchema.findOne({name : 'System Admin'}, function (err, role) {
          if (err) return done(err)
          if (role) {
            return done()
            // role.updateGrants(supportGrants, done);
          } else
            roleSchema.create(
              {
                name: 'System Admin',
                description: 'Default role for System Admin',
                grants: roleDefaults.systemAdminGrants
              },
              done
            )
        })
      },
      function (done) {
        roleSchema.findOne({name : 'System User'}, function (err, role) {
          if (err) return done(err)
          if (role) {
            return done()
            // role.updateGrants(supportGrants, done);
          } else
            roleSchema.create(
              {
                name: 'System User',
                description: 'Default role for System User',
                grants: roleDefaults.systemUserGrants
              },
              done
            )
        })
      },
      function (done) {
        roleSchema.findOne({name : 'Client Admin'}, function (err, role) {
          if (err) return done(err)
          if (role) {
            return done()
            // role.updateGrants(supportGrants, done);
          } else
            roleSchema.create(
              {
                name: 'Client Admin',
                description: 'Default role for Client Admin',
                grants: roleDefaults.clientAdminGrants
              },
              done
            )
        })
      },
      function (done) {
        roleSchema.findOne({name : 'Agent'}, function (err, role) {
          if (err) return done(err)
          if (role) {
            return done()
            // role.updateGrants(supportGrants, done);
          } else
            roleSchema.create(
              {
                name: 'Agent',
                description: 'Default role for Agent',
                grants: roleDefaults.agentGrants
              },
              done
            )
        })
      },
      function (done) {          
          roleSchema.findOne({name : 'Super User'}, function (err, role) {
            if (err) return done(err)
            if (role) {
              userSchema.findOne({username : 'Admin'}, function (err, user) {
                if (err) return done(err)
                if (user) {
                  return done()
                  // role.updateGrants(supportGrants, done);
                } else
                  userSchema.create(
                    {
                      username: 'Admin',
                      email: 'admin@gmail.com',
                      role: role._id,
                      first_name: 'Admin',
                      last_name: 'User'
                    },
                    done
                  )
              })
            }
          })
      },
      function (done) {          
          userSchema.findOne({username : 'Admin'}, function (err, user) {
            if (err) return done(err)
            if (user) {
              var obj = {}
              obj.is_password_set = true
              obj.password = '123456'
              userSchema.updatePassword(user._id, obj, function(err, user) {
                  if (!user)
                      console.log("data is not found");
                  else if(err)
                      console.log("Something went wrong")
                  else
                      done
              })
            }
          })
      }
    ])

})

userRoutes.route('/authenticate').post(async (req, res) => {
    const { email, password } = req.body;
    userSchema.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect email or password'
          });
      } else {
        userSchema.isCorrectPassword(password, user.password, function(err, same) {
          if (err) {
            res.status(500)
              .json({
                error: err
            });
          } else if (!same) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
            });
          } else {
            //Issue token
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            });
            // res.cookie('token', token, { httpOnly: true })
            //   .sendStatus(200);
            console.log('LOGIN SUCCESS')
            console.log(user)

            res.json(user)
          }
        });
      }
    });
  });
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
Routes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    clientSchema.findById(id, function(err, client) {
        res.json(client);
    });
});
Routes.route('/update/:id').post(function(req, res) {
    clientSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, client) {
        if (!client)
            res.status(404).send("data is not found");
        else if(err)
            res.status(404).send("Something went wrong")
        else
            res.json(client);
    });
});
Routes.route('/update_service').post(function(req, res) {
  var requestBody = req.body
  
  requestBody.twitter_consumer_key = base64.encode(requestBody.twitter_consumer_key)
  requestBody.twitter_consumer_secret = base64.encode(requestBody.twitter_consumer_secret)
  requestBody.twitter_access_token = base64.encode(requestBody.twitter_access_token)
  requestBody.twitter_access_token_secret = base64.encode(requestBody.twitter_access_token_secret)

  clientSchema.findOneAndUpdate({ _id: requestBody.client }, requestBody, function(err, client) {
      if (!client)
          res.status(404).send("data is not found");
      else if(err)
          res.status(404).send("Something went wrong")
      else
          res.json(client);
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
// userRoutes.route('/').get(async (req, res) => {
//     userSchema.find(function(err, clients) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(clients)
//             res.json(clients);
//         }
//     });
// });
userRoutes.route('/').get(async (req, res) => {
    console.log('USERS')
    userSchema.find(function(err, users) {
        if(err) {
            console.log(err);
        }
        else {
            res.json(users);
        }
    });
});

userRoutes.route('/userByClient/:id').get(async (req, res) => {
    console.log('USERS')
    userSchema.find({client : req.params.id}, function(err, users) {
        if(err) {
            console.log(err);
        }
        else {
            res.json(users);
        }
    });
});

userRoutes.route('/create').post(async (req, res) => {
console.log('New User..');
console.log(req.body);
if(req.body.client == '') {
    req.body.client = []
}
let user = new userSchema(req.body);
user.save()
.then(todo => {
    templateSchema.findOne(function(err, template) {
        if(err) {}

        if(template) {
                var idEncode = base64.encode(req.body.email)
                var fullUrl = req.protocol + '://' + req.get('host')
                var finallFull = fullUrl.replace('4', '3')
                // console.log('FULL URL'+finallFull)
                var link = finallFull+'/user/password/'+idEncode
                var content = template.content
                var content1 = content.replace('{link}', link)
                var content2 = content1.replace('{name}', req.body.first_name)
                console.log(content2)
                // content.concat("<p>Here is a link to setup password</p>")
                // content.concat("<br/>")
                // content.concat(link)
                settingSchema.findOne(function(err, settings) {
                    if(err) {}

                    if(settings) {
                        console.log(settings.server)
                        console.log(settings.port)
                        console.log(settings.auth_username)
                        console.log(settings.auth_password)
                        console.log(settings.from_address)
                    
                        var transporter = nodemailer.createTransport({
                        host: settings.server,
                        port: settings.port,
                        auth: {
                            user: settings.auth_username,
                            pass: settings.auth_password
                        }    
                    
                        });

                        var mail = {
                        from: settings.from_address, 
                        to: req.body.email, 
                        subject: template.subject,
                        html: content2
                        }
                    
                        transporter.sendMail(mail, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Mail sent')
                        }
                        })
                    }
                }) 
            }
        })  
            
                res.status(200).json({'user': 'user added successfully'});
})
.catch(err => {
res.status(400).send(err);
});
});

userRoutes.route('/delete/:id').delete(async (req, res) => {
    console.log('New User')
    console.log(req.body)
    userSchema.deleteOne({ _id : req.params.id})
    .then(todo => {
        userSchema.find(function(err, users) {
        res.status(200).json(users);
        })
    })
    .catch(err => {
        console.log(err)
        res.status(400).send(err);
    });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname
    cb(null, 'client_' + file.originalname )
  }
})
var upload = multer({ storage: storage }).single('file')

Routes.route('/upload').post(async (req, res) => {
//    console.log('DFDFDF'+fileName)
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});

userRoutes.route('/getByEmail/:email').get(async (req, res) => {
    const user = await userSchema.findOne({ email : req.params.email})

    if (!user)
    return res
    .status(404)
    .send("The user with the given ID was not found.");

    res.send(user);
});
userRoutes.route('/user/:id').get(async (req, res) => {
    const user = await userSchema.findById(req.params.id)

    if (!user)
        return res
        .status(404)
        .send("The user with the given ID was not found.");

    res.send(user);
});
userRoutes.route('/edit/:id').put(async (req, res) => {
    if(req.body.password) {
        var password = req.body.password
        var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        req.body.password = hashedPassword
        req.body.is_password_set = true
    }
    userSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, client) {
        if (!client)
            res.status(404).send("data is not found");
        else if(err)
            res.status(404).send("Something went wrong")
        else
            res.json(client);
    });

});
userRoutes.route('/update-password/:id').put(async (req, res) => {
    
    req.body.is_password_set = true
    
    userSchema.updatePassword(req.params.id, req.body, function(err, client) {
        if (!client)
            res.status(404).send("data is not found");
        else if(err)
            res.status(404).send("Something went wrong")
        else
            res.json(client);
    });

});
// app.use((req, res, next) => {
// res.setHeader('Access-Control-Allow-Origin', '*'); // to enable calls from every domain 
// res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // allowed actiosn
// res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 

// if (req.method === 'OPTIONS') {
//     return res.sendStatus(200); // to deal with chrome sending an extra options request
// }

// next(); // call next middlewer in line
// });

twitterRoutes.route('/').get( async(req, res) => {
  console.log('Twitter_key');
  twitterSchema.find(function(err, data) {
    if(err) {
      console.log(err);
    }
    else {
      res.json(data);
    }
  });
})

twitterRoutes.route('/create_key').post( async (req, res) => {
  twitter_key = new twitterSchema(req.body)

  const salt = await bcrypt.genSalt(10);
  twitter_key.key = await bcrypt.hash(twitter_key.key, salt);
  twitter_key.access_key = await bcrypt.hash(twitter_key.access_key, salt);

  await twitter_key.save()
    .then( todo => {
      return res.status(200).json({'Twitter': 'Success'});
    })
    .catch( err => {
      console.log(err);
      return res.status(400).send(err);
    });
});

// twitterRoutes.route('/create_key').post( async (req, res) => {
//   const salt = await bcrypt.genSalt(10);

//   if(req.body.key || req.body.access_key) {
//     let key = req.body.key;
//     let access_key = req.body.access_key;
//     let hashedKey = await bcrypt.hash(key, salt);
//     let hashedAccessKey = await bcrypt.hash(access_key, salt);
//     req.body.key = hashedKey;
//     req.body.access_key = hashedAccessKey;
//   }

//   if( twitterSchema.findByIdAndUpdate({ _id: req.params.id }, req.body, function(err, data) {
//     if(!data) 
//       return res.status(404).send('Data not found.')
//     else if(err)
//       return res.status(404).send('Something went wrong.')
//     else 
//       return res.json(data);
//   }));
  
//   twitter_key = new twitterSchema(req.body)

//   twitter_key.key = await bcrypt.hash(twitter_key.key, salt);
//   twitter_key.access_key = await bcrypt.hash(twitter_key.access_key, salt);

//   await twitter_key.save()
//     .then( todo => {
//       return res.status(200).json({'Twitter': 'Success'});
//     })
//     .catch( err => {
//       console.log(err);
//       return res.status(400).send(err);
//     });
// });

twitterRoutes.route('/edit_key/:id').put( async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  if(req.body.key || req.body.access_key) {
    let key = req.body.key;
    let access_key = req.body.access_key;
    let hashedKey = await bcrypt.hash(key, salt);
    let hashedAccessKey = await bcrypt.hash(access_key, salt);
    req.body.key = hashedKey;
    req.body.access_key = hashedAccessKey;
  }

  twitterSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, data) {
    if(!data) 
      res.status(404).send('Data not found.')
    else if(err)
      res.status(404).send('Something went wrong.')
    else 
      res.json(data);
  });
});

settingRoutes.route('/').get(function(req, res) {
    settingSchema.findOne(function(err, setting) {
        res.json(setting);
    });
});
settingRoutes.route('/update/:id').post(function(req, res) {
    settingSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, setting) {
        if (!setting)
            res.status(404).send("data is not found");
        else if(err)
            res.status(404).send("Something went wrong")
        else
            res.json(setting);
    });
});

templateRoutes.route('/').get(function(req, res) {
    console.log("YES")
    templateSchema.findOne(function(err, template) {
        if(err) {
            res.json(err)
        }
        console.log(template)
        res.json(template);
    });
});
templateRoutes.route('/update/:id').post(function(req, res) {
    console.log(req.params.id)
    console.log(req.body)
    templateSchema.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, setting) {
        if (!setting)
            res.status(404).send("data is not found");
        else if(err)
            res.status(404).send("Something went wrong")
        else
            res.json(setting);
    });
});

//Roles
roleRoutes.route('/').get(function(req, res) {
    roleSchema.find(function(err, roles) {
        res.json(roles);
    });
});
app.use('/clients', Routes);
app.use('/users', userRoutes)
app.use('/settings', settingRoutes)
app.use('/template', templateRoutes)
app.use('/roles', roleRoutes)
app.use('/twitter', twitterRoutes)

app.get('/webhook/twitter', function(request, response) {

  var crc_token = request.query.crc_token

  if (crc_token) {
    var hash = security.get_challenge_response(crc_token, '1bSUgNNOXpsZl2EdbJcAsoaL5E15Tsje66XqgySCxHWIrpNQYs')

    response.status(200);
    response.send({
      response_token: 'sha256=' + hash
    })
  } else {
    response.status(400);
    response.send('Error: crc_token missing from request.')
  }
})

//Twitter APIs
//Twitter autohook
// const imageData = fs.readFileSync("src/public/clients/1603182490941-anonymous.png") //replace with the path to your image

// console.log('imagedata')
// console.log(imageData
app.post('/twitter/followers', function(request, response1) {
  console.log("aasa")

  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })
  T.get('followers/list', function(err, data, response) {
    if(err) {
      response1.send({status : 500})
    }
    response1.send(data.users);
  })
})

app.post('/twitter/tweets', function(request, response1) {
  console.log("aasa")
  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })
  T.get('statuses/user_timeline', function(err, data, response) { 
    if(err) {
      response1.send({status : 500})
    }
    response1.send(data); 
  })
})

//Direct messages
// function convertTimestamp(timestamp) {
//   var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
// 		yyyy = d.getFullYear(),
// 		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
// 		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
// 		hh = d.getHours(),
// 		h = hh,
// 		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
// 		ampm = 'AM',
// 		time;
			
// 	if (hh > 12) {
// 		h = hh - 12;
// 		ampm = 'PM';
// 	} else if (hh === 12) {
// 		h = 12;
// 		ampm = 'PM';
// 	} else if (hh == 0) {
// 		h = 12;
// 	}
	
// 	// ie: 2013-02-18, 8:35 AM	
// 	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
		
// 	return time;
// }
app.post('/twitter/chats', function(request, response1) {
    console.log("aasa")
    var T = new Twit({
      consumer_key:         base64.decode(request.body.twitter_consumer_key),
      consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
      access_token:         base64.decode(request.body.twitter_access_token),
      access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
      timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
      // strictSSL:            true,     // optional - requires SSL certificates to be valid.
    })
    T.get('direct_messages/events/list', function(err, data, response) {
      // console.log('User has %d repos');
      if(err) { response1.send(err) 
      } else {
      // console.log(data.events)
      var chatBox = data.events
      var chatBoxArr = []
      
      var userChatArr = []

      chatBox.forEach(function(chats) {
        if(!userChatArr.includes(chats.message_create.sender_id)) {
          userChatArr.push(chats.message_create.sender_id)
        }
        if(!userChatArr.includes(chats.message_create.target.recipient_id)) {
          userChatArr.push(chats.message_create.target.recipient_id)
        }
      })

      userChatArr.forEach(function(chData) {
        var conversation = []
        chatBox.forEach(async function(chats) {
          if(chData === chats.message_create.sender_id || chData === chats.message_create.target.recipient_id){
            console.log('iff')
            var mediaURL = ''
            var finalMediaData = ''
            if(chats.message_create.message_data.attachment) {
              if(chats.message_create.message_data.attachment.type == 'media') {
                mediaURL = chats.message_create.message_data.attachment.media.media_url_https
                
                const getResponse = await axios.get(mediaURL, { headers: {
                  Authorization: 'OAuth oauth_consumer_key="F8xqPxo7D4A5Og4EeJyQKkY9m",oauth_token="1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1604494480",oauth_nonce="ahqvsp",oauth_version="1.0",oauth_signature="kLk1ewZRHOM8TPsI5DUBrLNSnqA%3D"'
                }});

              //  const mergedResponses = { ...getResponse.data };
              //  console.log(getResponse.data)
               finalMediaData = getResponse.data
              }
            }
            var isFrom = false
            if(chData === chats.message_create.sender_id) {
              isFrom = true
            }
            console.log(finalMediaData)
            conversation.push({id: chats.id, isFrom : isFrom, text : chats.message_create.message_data.text, toId : chats.message_create.target.recipient_id, fromId : chats.message_create.sender_id, send_time : chats.created_timestamp, media : mediaURL })
          

          }
        })
        chatBoxArr.push({id : chData, ownerId : '1281552432514859008', conversation : conversation})          

      })
      console.log(chatBoxArr)
      
      response1.send(chatBoxArr);
    }

  })
})

// async function getMedialData(url) {
//   var options = {
//     method: 'GET',
//     url: url,
//     headers: {
//       Authorization: 'OAuth oauth_consumer_key="F8xqPxo7D4A5Og4EeJyQKkY9m",oauth_token="1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1604494480",oauth_nonce="ahqvsp",oauth_version="1.0",oauth_signature="kLk1ewZRHOM8TPsI5DUBrLNSnqA%3D"'
//     }
//   };
  
//   var mediaData = axios.request(options).then(function (response) {
//     console.log('SUCCESS');
    
//     return response.data
//   }).catch(function (error) {
//     console.error(error);
//     return error
//   });
//   return mediaData
// }

app.get('/twitter/users/:id', function(request, response1) {
  console.log(request)
  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

  T.get('users/show', {id : request.params.id}, function(err, data, response) {
      if(err) {
        response1.send({status : 400})
      }
      response1.send(data);
  });
})


app.post('/twitter/lookup/:id', function(request, response1) {
  console.log(request)
  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

  T.get('users/show', { id: request.params.id },  function (err, data, response) {
    console.log('Twit package data')
    console.log(data) 
    response1.send(data)
  })
  
});



// T.get('users/lookup', { screen_name: 'xepa_pandya' },  function (err, data, response) {
//   console.log('Twit package data')
//   console.log(data)
// })
// var T = new Twit({
//   consumer_key:         'F8xqPxo7D4A5Og4EeJyQKkY9m',
//   consumer_secret:      '1bSUgNNOXpsZl2EdbJcAsoaL5E15Tsje66XqgySCxHWIrpNQYs',
//   access_token:         '1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm',
//   access_token_secret:  'kdXIW35gxYf7si2FDd9RissqnQ0TwfAYIBMqp2f5ycwGa',
//   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   // strictSSL:            true,     // optional - requires SSL certificates to be valid.
// })
// T.get('account/verify_credentials', {
//   include_entities: false,
//   skip_status: true,
//   include_email: false
// }, onAuthenticated)

// function onAuthenticated(err){
//   if (err) {
//       console.log(err)
//   } else {
//   console.log('Authentication successful.')
// }}


var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname+ Date.now()
    cb(null, file.originalname + '-' + Date.now() )
  }
})
var upload1 = multer({ storage: storage1 }).single('file')

app.post('/twitter/media/upload',function (req, res) {
//    console.log('DFDFDF'+fileName)
    upload1(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
      console.log('FILE Multer')
      console.log(req.file)      
      return res.send(req.file)

    })
});

app.post('/twitter/direct_message', function(request, response1) {
console.log("MESSAGE REQUEST")
console.log(request.body)

var T = new Twit({
  consumer_key:         base64.decode(request.body.twitter_consumer_key),
  consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
  access_token:         base64.decode(request.body.twitter_access_token),
  access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

var msgBody =request.body
if(msgBody.filename) {
var b64content = fs.readFileSync('public/'+msgBody.filename, { encoding: 'base64' })

// first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string
  var altText = "Small flowers in a planter on a sunny balcony, blossoming."
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
console.log("mediaIdStr")
console.log(mediaIdStr)
  T.post('media/metadata/create', meta_params, function (err, data, response) {
    if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
      // var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
      var events = {
        event : {
            type: "message_create",
            message_create: {
                target: {
                    recipient_id: request.body.recipient_id
                },
                message_data: {
                    text: request.body.message,
                    attachment : {
                      type : 'media',
                      media : {
                        id : mediaIdStr
                      }
                    }                    
                }
                
            }
        }
      }
      T.post('direct_messages/events/new', events, function (err, data, response) {
        console.log(data)
        console.log('RESULT||')
        console.log(err)
        if(err) {
        response1.send({status : 400, data : err})
        } else {
          response1.send({status : 200, data : data.event})
        }
      })
    }
  })
})
} else {
  var events = {
    event : {
        type: "message_create",
        message_create: {
            target: {
                recipient_id: request.body.recipient_id
            },
            message_data: {
                text: request.body.message
            }
            
        }
    }
  }
  T.post('direct_messages/events/new', events, function (err, data, response) {
    
    console.log(data)
    console.log('RESULT||')
    console.log(err)
    if(err) {
    response1.send({status : 400, data : err})
    } else {
      response1.send({status : 200, data : data.event})
    }
  })
}
})

app.post('/twitter/image', function(request, response1) {
  
  // var options1 = {
  //   headers: {
  //       'Authorization': 'OAuth oauth_consumer_key="F8xqPxo7D4A5Og4EeJyQKkY9m",oauth_token="1281552432514859008-kEz3AQd9J1GH9R8qju99YG42RwuGcm",oauth_signature_method="HMAC-SHA1",oauth_timestamp="GENERATED",oauth_nonce="GENERATED",oauth_version="1.0",oauth_signature="GENERATED"'
  //   }
  // };
  // request.get('https://ton.twitter.com/1.1/ton/data/dm/1034828552951160836/1034828533812486145/oP5p359h.jpg',options1, function (e, r, user) {
  //   console.log(e)
  //   console.log(r)
  //   console.log(user)
  //   console.log('sdfsdfsdf')
  // })
  var imageBody = request.body
  console.log(imageBody)
  var options = {
    method: 'GET',
    url: imageBody.image,
    headers: {
      Authorization: 'OAuth oauth_consumer_key='+base64.decode(imageBody.twitter_consumer_key)+',oauth_token='+base64.decode(imageBody.twitter_access_token)+',oauth_signature_method="HMAC-SHA1",oauth_timestamp="1604494480",oauth_nonce="ahqvsp",oauth_version="1.0",oauth_signature="kLk1ewZRHOM8TPsI5DUBrLNSnqA%3D"'
    }
  };
  
  axios.request(options).then(function (response) {
    console.log('SUCCESS');
    
    response1.send(response.data)
  }).catch(function (error) {
    console.error(error);
    response1.send(error)
  });
  
});

//Post new Tweet
app.post('/twitter/tweet/new', function(request, response) {
  var tweetBody =request.body

  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

  if(tweetBody.tweetMediaName) {
    var b64content = fs.readFileSync('public/'+tweetBody.tweetMediaName, { encoding: 'base64' })
    
    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, function (err, data, response1) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = "Alternative image text"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
        console.log("mediaIdStr")
        console.log(mediaIdStr)
          T.post('media/metadata/create', meta_params, function (err, data, response2) {
            if(err) { console.log(err) }
            if (!err) {
              var tweetData = ''
              if(tweetBody.in_reply_to_status_id != '') {
                tweetData = {
                  status : request.body.text,
                  in_reply_to_status_id : tweetBody.in_reply_to_status_id,
                  media_ids : [mediaIdStr]
                }
              } else {
                tweetData = {
                  status : request.body.text,
                  media_ids : [mediaIdStr]
                }
              }
  
              console.log('TWEETDATA')
              console.log(tweetData)
              T.post('statuses/update', tweetData, function (err, data, response3) {
                if(err) { 
                  response.send({status : 500, data : err})
                } 
                io.emit('tweet_event')
                response.send({status : 200, data : data})
              })
            }
          })
    })
  } else {
    var tweetData = ''
    if(tweetBody.in_reply_to_status_id != '') {
      tweetData = {
        status : request.body.text,
        in_reply_to_status_id : tweetBody.in_reply_to_status_id
      }
    } else {
      tweetData = {
        status : request.body.text
      }
    }
    
    console.log('TWEETDATA')
    console.log(tweetData)
    T.post('statuses/update', tweetData, function (err, data, response1) {
      if(err) { 
        response.send({status : 500, data : err})
      } 
      io.emit('tweet_event')
      response.send({status : 200, data : data})
    })
  }
})

//Retweet
app.post('/twitter/retweet', function (request, response) {
  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

  var reTweetBody =request.body
  console.log(reTweetBody)
  if(reTweetBody.text != '') {
    T.post('statuses/retweet/' + reTweetBody.tweetId, {status: reTweetBody.text}, function(error, tweet, response1) {
      if (!error) {
        console.log(tweet);
      }
      io.emit('tweet_event')
      response.send({status : 200, data : tweet})
    }); 
  } else {
    T.post('statuses/retweet/' + reTweetBody.tweetId, function(error, tweet, response1) {
      if (!error) {
        console.log(tweet);
      }
      io.emit('tweet_event')
      response.send({status : 200, data : tweet})
    }); 
  } 
})

//Like tweet
app.post('/twitter/tweet/like', function(request, response) {
  var likeBody = request.body

  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

  T.post('favorites/create', {id : likeBody.tweetId}, function(err, data, response1) {
    console.log(data)
    if (err) {
      // console.log(tweet);
      response.send({status : 500})
    }
    io.emit('tweet_event')
    response.send({status : 200, data : data})
  })
})

//Unlike tweet
//Like tweet
app.post('/twitter/tweet/unlike', function(request, response) {
  var likeBody = request.body

  var T = new Twit({
    consumer_key:         base64.decode(request.body.twitter_consumer_key),
    consumer_secret:      base64.decode(request.body.twitter_consumer_secret),
    access_token:         base64.decode(request.body.twitter_access_token),
    access_token_secret:  base64.decode(request.body.twitter_access_token_secret),
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

  T.post('favorites/destroy', {id : likeBody.tweetId}, function(err, data, response1) {
    console.log(data)
    if (err) {
      // console.log(tweet);
      response.send({status : 500})
    }
    io.emit('tweet_event')
    response.send({status : 200, data : data})
  })
})

app.post('/service/update/whatsapp_details', function(request, response1) {
  var waDetails = request.body
  if(waDetails.service_provider == 'Karix') {
    var options = {
      method: 'GET',
      url: 'https://api.karix.io/whatsapp/profile/business/46762423331',
      headers: {
        Authorization: 'Basic MTZhOWI3YzktMWRkMi00MGEwLThhNGUtZTQwYTdkMzUxZDVjOjcyZTRhY2MyLTFiMzUtNGMxOC05OTMyLWZhMjZiZjY0ZTIyYQ==',
        "Content-Type": "application/json"
      }
    };
    
    axios.request(options).then(function (response) {
      console.log('SUCCESS1');    
      // response1.send(response.data)
      var waDetailsObj = response.data.data
      var websitesData = waDetailsObj.websites

      if(waDetails.websites) {
        waDetails.websites = [waDetails.websites]
      } else {
        waDetails.websites = websitesData
      }

      delete waDetails.client
      delete waDetails.service_provider
      
      var options = {
        method: 'PATCH',
        url: 'https://api.karix.io/whatsapp/profile/business/46762423331',
        headers: {
          Authorization: 'Basic MTZhOWI3YzktMWRkMi00MGEwLThhNGUtZTQwYTdkMzUxZDVjOjcyZTRhY2MyLTFiMzUtNGMxOC05OTMyLWZhMjZiZjY0ZTIyYQ==',
          "Content-Type": "application/json"
        },
        data: waDetails
      };
      
      axios.request(options).then(function (response2) {
        console.log('SUCCESS2');    
        response1.send(response2.data)
        
      }).catch(function (error) {
        console.error(error);
        response1.send(error)
      });

    }).catch(function (error) {
      console.error(error);
      response1.send(error)
    });
  }
})

// T.get('https://ton.twitter.com/1.1/ton/data/dm/1034828552951160836/1034828533812486145/oP5p359h.jpg', function(err,data,response) {
//   console.log(data)
//   console.log(err)
// })

server.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});



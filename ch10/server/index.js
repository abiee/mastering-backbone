var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var morgan = require('morgan');
var auth = require('./oauth2-middleware');
var controller = require('./contacts-controller');

var server = express();

// Show the requests in the console, useful for debug
server.use(morgan('dev'));

// Automatically parse JSON requests
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());

// Configure all available routes
server.post('/api/oauth/token', auth.authenticate);
server.post('/api/contacts', auth.authorizationRequired, controller.createContact);
server.get('/api/contacts', auth.authorizationRequired, controller.showContacts);
server.get('/api/contacts/:contactId', auth.authorizationRequired, controller.findContactById);
server.put('/api/contacts/:contactId', auth.authorizationRequired, controller.updateContact);
server.delete('/api/contacts/:contactId', auth.authorizationRequired, controller.deleteContact);

// Avatar endpoints
var upload = multer();
server.post('/api/contacts/:contactId/avatar', upload.single('avatar'),
  controller.uploadAvatar
);
server.use('/avatar', express.static(__dirname + '/avatar'));

http.createServer(server).listen(8000, function() {
  console.log('Express server is running on port 8000');
});

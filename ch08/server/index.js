var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var morgan = require('morgan');
var controller = require('./contacts-controller');

var server = express();

// Show the requests in the console, useful for debug
server.use(morgan('dev'));

// Automatically parse JSON requests
server.use(bodyParser.json());

// Configure all available routes
server.post('/api/contacts', controller.createContact);
server.get('/api/contacts', controller.showContacts);
server.get('/api/contacts/:contactId', controller.findContactById);
server.put('/api/contacts/:contactId', controller.updateContact);
server.delete('/api/contacts/:contactId', controller.deleteContact);

// Avatar endpoints
var upload = multer();
server.post('/api/contacts/:contactId/avatar', upload.single('avatar'),
  controller.uploadAvatar
);
server.use('/avatar', express.static(__dirname + '/avatar'));

http.createServer(server).listen(8000, function() {
  console.log('Express server is running on port 8000');
});

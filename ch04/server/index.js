var http = require('http');
var browserSync = require('browser-sync');
var httpProxy = require('http-proxy');
var express = require('express');
var bodyParser = require('body-parser');
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

http.createServer(server).listen(9000, function() {
  // Server proxy will redirect all API trafic to the express server
  // while BrowserSync will serve the assets
  var serverProxy = httpProxy.createProxyServer();

  browserSync({
    open: true,
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [
        function (req, res, next) {
          // Redirect all trafic which starts with /api/
          if (req.url.match(/^\/api\/.*/)) {
            serverProxy.web(req, res, {target: 'http://localhost:9000'});
          } else {
            next();
          }
        }
      ]
    },
    files: [
      'app/*.html',
      'app/js/**/*.js',
      'app/css/*.css'
    ]
  });
});

var express = require('express'), 
  fs = require('fs'),
  url = require('url');

var app = module.exports = express.createServer();

// despite init-ing in the chameleon directory
// we need to serve static files from dojo, dijit, dojox etc.
// dojoPath is the 'dojotoolkit' directory that contains dojo, dijit, etc.
var dojoPath = __dirname + "/../../..";

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  
  app.set("view engine", "html");
  app.set('view options', {
    layout: false
  });
  app.register(".html", require("jqtpl").express);
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // app.use(express['static'](__dirname + '/public'));
  // map dojo, dijit etc. as /dojo, /dijit, etc.
  app.use(express['static'](dojoPath));
  app.use(express.directory(dojoPath))
  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var context = {
    themeDir: url.resolve(__dirname +"/", "../claro"),
    themeUrl: '/dijit/themes/chameleon',
    dojoBaseUrl: '',
    transform: {
      name: ['claro', 'chameleon'],
      Name: ['Claro', 'Chameleon']
    }
};

console.log("dirname: " + __dirname + ", themeDir: " + context.themeDir);

// setup routes
require('chameleon/routes')(app, express, context);

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

var express = require('express'), 
  fs = require('fs');

var app = module.exports = express.createServer();

// despite init-ing in the chameleon directory
// we need to serve static files from dojo, dijit, dojox etc.
// dojoPath is the 'dojotoolkit' directory that contains dojo, dijit, etc.
var dojoPath = __dirname + "/../../..";

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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

// Routes
app.get('/dijit/themes/themeTester.html', function(req, res){

  // templated response, 
  // render the themeTester 
  // passing in template context data


  var data = {
    contextPath: ""
  };
  // TODO: implement as view w. simple template engine
  // res.render('index', data);
  
  // send parameterized contents of a static file
  fs.readFile(
    __dirname + '/themeTester.html', 
    function(err, html){
      html = html.toString().replace(/\$\{([^\}]+)\}/g, function(m, name){
        return data[name] || "";
      });
      res.contentType('text/html');
      res.send(html);
    }
  );   
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

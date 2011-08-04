var express = require('express');

var app = express.createServer();

// despite init-ing in the chameleon directory
// we need to serve static files from dojo, dijit, dojox etc.
var dojoPath = __dirname + "/../../..";

app.configure(function(){
    app.use(express.static(dojoPath));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/dijit/themes/chameleon/', function(req, res){
    res.send('Hello chameleon World');
});

app.listen(3000);
/* 
    / (default route)
        redirect to dijit/theme/chameleon/
    dijit/theme/chameleon/edit    
        serve up themetester.html
        ui to edit theme
            pick name or create new
            redirect to...
    /{themeid}/
        
	you get a random theme name when you hit chameleon/ (themeTester-alike)
	can use git to clone? that would let us produce a nice diff. 
	
	it clones claro (or itself)
		paths in chameleon/ are adjusted to this temporary theme id
		iow, themeTester is dynamic. So its served through node
		the edit UI writes via POST to your temporary theme clone
		maybe it writes to /tmp, and via magic of alias puts it at /dijit/theme/123123

	in CLI context: 
		node index.js
			pick up config from ...?
			apply the same transform
			but write out w. File writer, instead of response writer

*/
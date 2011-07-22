// Module Dependencies

var express = require('express');

var redis = require('redis');
var client = redis.createClient();
var stylus = require('stylus');
var nib = require('nib');

var app = module.exports = express.createServer();

// Configuration

function compile(str, path){
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/:key?', function(req, res, next){
  var key = req.params.key;
  console.log('key='+key);
  if (key!=null && key!='favicon.ico'){
    client.get(key, function(err, reply){
      if(client.get(reply)){
        console.log('reply='+reply);
        if(reply==null){
          res.render('index', {
            link: null
          });
        }
        else{
          res.redirect(reply);
        }
      }
      else{
        res.render('index', {
          link: null
        });
      }
    });
  }
  else {
    next();
  }
});

app.get('/', function(req, res){
  res.render('index', {
    link: null
  });
});

app.post('/', function(req, res){
  function makeRandom(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < 3 /*y u looking at me <33??*/ ; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  var url = req.body.user.url;
  var urlH = url.search('http://');
  if(urlH==-1){
    url = 'http://' + url;
  }
  var urlD = url.search('.com');
  if(urlD==-1){
    url = url + '.com';
  }
  var key = makeRandom();
  client.set(key, url);
  var link = 'http://50.22.248.74/' + key;
  res.render('index', {
    link: link
  });
  console.log(url);
  console.log(key);
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(80);
  console.log("Express server listening on port %d", app.address().port);
}

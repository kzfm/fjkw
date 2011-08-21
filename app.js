
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fjkw');
var Schema = mongoose.Schema;

var WikiContent = new Schema({
    title     : String
  , body      : String
  , date      : Date
});

mongoose.model('WikiContent', WikiContent);
WikiContent = mongoose.model('WikiContent');

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
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

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.get('/new', function(req, res){
  res.render('form', {
    title: 'new wiki form'
  });
});

app.post('/new', function(req, res){
  new WikiContent({title: req.param('title'), body: req.param('body'), date: new Date()}).save( 
        function (){
	  res.redirect('/'+req.param('title'));						 
      });
  });


app.get('/:title', function(req, res){
  WikiContent.findOne({title: req.params.title}, function (err, content) {
    res.render('wiki', {
      title: content.title,
      body: content.body,
      date: content.date
    });
  });
});

app.post('/:title', function(req, res){
  WikiContent.findOne({title: req.params.title}, function (err, content) {
    if (content == null) {
      new WikiContent({title: req.params.title, body: req.param('body'), date: new Date()}).save( 
        function (){
	  res.redirect('/'+req.params.title);						 
      });
    } else {

    }
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

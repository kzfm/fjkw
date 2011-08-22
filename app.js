
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
    title: 'fjkw'
  });
});

app.get('/:title', function(req, res){
  WikiContent.findOne({title: req.params.title}, function (err, content) {
      if (content == null) {
        res.render('form', {
          title: req.params.title
        });
      } else {
        res.render('wiki', {
        title: content.title,
        body: content.body,
        date: content.date
        });
      }
  });
});

app.post('/:title', function(req, res){
  WikiContent.findOne({title: req.params.title}, function (err, content) {
    if (content == null) {
      new WikiContent({title:  req.params.title, body: req.param('body'), date: new Date()}).save( 
        function (){
          res.redirect('/'+req.params.title);
      });       
    } else {
      content.body = req.param('body');
      content.date = new Date();
      content.save( 
        function (){
          res.send(req.param('body'));
      });       
    }
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

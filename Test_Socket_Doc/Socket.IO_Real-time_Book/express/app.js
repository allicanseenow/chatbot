var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// This is used for all environments
/*
  This is similar to:
    app.configure(() => doSomething()); =>>  doSomething()    // all environment

    app.configure(('production') => doSomething()) =>> if ('development' === app.get('env')) doSomething();

 */
app.configure(() => {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  /*
    app.set('title', 'A title');    // Assign 'title' to "A title'
    app.get('title') === 'A title'

   */
  app.set('view engine', 'jade');
  // express middleware is used sequentiallly
  app.use(express.favicon());
  // Without any configuration, the logger middleware will generate a detailed log using what is called
  // the default format. The logger actually supports four predefined log formats: default, short ,tiny, and dev.
  // Each of these predefined formats show various amounts of detail. You can specify one of them this way
  app.use(express.logger('dev'));
  // Use this to handle "POST" request, where body portion is exposed to "req.body"
  app.use(express.bodyParser());
  // The methodOverride() middleware is for requests from clients that only natively support simple verbs like GET and POST.
  // So in those cases you could specify a special query field (or a hidden form field for example) that indicates the real
  // verb to use instead of what was originally sent. That way your backend .put()/.delete()/.patch()/etc. routes don't
  // have to change and will still work and you can accept requests from all kinds of clients.
  app.use(express.methodOverride());
  // @deprecated in version 4
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', () => {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
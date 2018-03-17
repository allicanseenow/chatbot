
/**
 * Module dependencies.
 */
let express = require('express');
let routes = require('./routes');
let user = require('./routes/user');
let http = require('http');
let path = require('path');
let connect = require('connect');
let bodyParser = require('body-parser');
let session = require('express-session');
let methodOverride = require('method-override');
let RedisStore = require('connect-redis')(session);

let app = express();

let sessionStore = new RedisStore();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(express.json());
app.use(bodyParser.json());
// app.use(express.cookieParser('secret_key'));
app.use(session({ secret: 'secret_key', key: 'express.sid', store: sessionStore, resave: true,  }));
app.use(express.urlencoded());
app.use(methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/chatroom', routes.chatRoom);
app.get('/rooms', routes.rooms);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use((req, res, next) => {
  require('./routes/sockets').initialize(server, res);
  next();
});
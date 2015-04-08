'use strict';

var express      = require('express'),
    _            = require('lodash'),
    error        = require('http-errors'),
    path         = require('path'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    sfstore      = require('session-file-store'),
    less         = require('less-middleware'),
    js           = require('./app/middleware/js'),
    auth         = require('./app/middleware/auth'),
    json         = require('./app/middleware/json'),
    routesRoot   = require('./app/routes/root'),
    routesApi    = require('./app/routes/api'),
    config       = require('./app/config'),
    app          = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  store: new (sfstore(session))({
    path: path.join(__dirname, 'tmp', 'sessions')
  }),
  resave: false,
  saveUninitialized: true,
  secret: config.sessions.secret,
  cookie: {
    path: config.api.mountpoint,
    httpOnly: true,
    secure: false,
    maxAge: null
  },
  name: config.sessions.name
}));

if (app.get('env') === 'development') {
  app.use(less(path.join(__dirname, 'assets'), config.assets.less));
  app.use(js(__dirname, config.assets.js));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/templates',
    express.static(path.join(__dirname, 'assets/templates')));
}

app.use('/', routesRoot);

// the rest is api so authentication and json middlewares are applied here
app.use(auth);
app.use(json);
app.use(config.api.mountpoint, routesApi);

app.use(function(req, res, next) {
  next(error(404));
});

app.use(function(err, req, res, cb) {
  res.status(err.status || 500);
  if (req.path.indexOf(config.api.mountpoint) === 0) {
    res.json(_.pick({
      code: res.statusCode,
      message: err.message,
      details: _.isEmpty(err) ? false : err
    }, _.identity));
  } else {
    res.send(err.toString());
  }
  cb();
});

module.exports = app;

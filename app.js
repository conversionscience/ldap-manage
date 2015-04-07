'use strict';

var express      = require('express'),
    _            = require('lodash'),
    LDAP         = require('LDAP'),
    error        = require('http-errors'),
    path         = require('path'),
    logger       = require('morgan'),
    extend       = require('extend'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    sfstore      = require('session-file-store'),
    less         = require('less-middleware'),
    js           = require('./lib/middleware/js'),
    auth         = require('./lib/middleware/auth'),
    routes       = {
                     root: require('./routes/root'),
                     api: require('./routes/api')
                   },
    config       = require('./config.json'),
    app          = express();

try {
  extend(true, config, require('./config_local.json'));
} catch(e) {}

try {
  extend(true, config, require('/etc/ldap-manager/config.json'));
} catch(e) {}

var ldap = new LDAP(config.ldap.server);
ldap.open(function(err) {
  if (err) throw err;
});

app.set('config', config);
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

app.use(auth({
  ldap: ldap,
  base: config.ldap.schema.people,
  filter: config.ldap.schema.filter
}));

app.use('/', routes.root);
app.use(config.api.mountpoint, routes.api);

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

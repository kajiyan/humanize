var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');

var config         = require('config');
var winston        = require('winston');
var expressWinston = require('express-winston');
var winstonConfig  = require('./config/winston-config.js')
var swig           = require('swig');

var helpers = require(config.PATH.HELPERS);
// var models = require(config.PATH.MODELS);
var controllers = require(config.PATH.CONTROLLERS);
var sockets = require(config.PATH.SOCKETS);


var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view cache', true);
swig.setDefaults({ cache: false });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(winstonConfig.settingExpress());


app.set(config.HELPERS, helpers);
// app.set(config.MODELS, models);
app.set(config.CONTROLLERS, controllers);
app.set(config.SOCKETS, sockets);


module.exports = app;
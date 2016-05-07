/**
 * Controllers
 * @classdesc コントローラーを管理するクラス
 */
var Controllers = (function() {
  var fs = require('fs');
  var path = require('path');
  var winston = require('winston');
  var config = require('config');
  var events = require('events');
  var _ = require('lodash');

  var _app;
  var _controllers = {};

  /**
   * Controllers constructor
   * @constructor
   */
  function Controllers() {
    winston.info('[Controllers] constructor');
  }


  /**
   * Controllers#setup
   * config.PATH.Controllers 以下にあるコントローラーファイルをすべて読み込む
   */
  Controllers.prototype.setup = function(app) {
    winston.info('[Controllers] setup');

    _app = app;

    var helpers = _app.get(config.HELPERS),
        util = helpers.getHelper({helperName: 'util'});

    return new Promise((resolve, reject) => {
      util.
        getFileList({ dirPath: config.PATH.CONTROLLERS }).
        then(
          (_fileList) => {
            return util.addRequires({
              fileList: _fileList,
              matchFileName: 'index.js',
              matchDirName: config.CONTROLLERS,
              incrudeTarget: _controllers
            })
          },
          (error) => {
            winston.error(error);
          }
        ).
        then(
          () => {
            _app.use(function(req, res, next) {
              res.header('Access-Control-Allow-Origin', "*");
              res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
              res.header('Access-Control-Allow-Headers', 'Content-Type');
              next();
            });

            _.forEach(_controllers, (controllers, key) => {
              if (typeof controllers['setup'] === 'function') {
                controllers.setup(_app);
              }

              _app.use('/', controllers.getRouter());
            });

            // catch 404 and forward to error handler
            _app.use(function(req, res, next) {
              var err = new Error('Not Found');
              err.status = 404;
              next(err);
            });

            // error handlers

            // development error handler
            // will print stacktrace
            if (_app.get('env') === 'development') {
              _app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                  message: err.message,
                  error: err
                });
              });
            }

            // production error handler
            // no stacktraces leaked to user
            _app.use(function(err, req, res, next) {
              res.status(err.status || 500);
              res.render('error', {
                message: err.message,
                error: {}
              });
            });

            resolve();
          }
        );
    });
  };

  /**
   * getController
   * 引数に指定された名前のコントローラを返す
   *
   * @param {Object} _options
   * @prop {string} [_options.controllerName] - 取得するコントローラの名前
   */
  Controllers.prototype.getController = function(_options) {
    var options = _.extend({
      'controllerName': null
    }, _options);

    if(options.controllerName != null) {
      try {
        var controller = _controllers[options.controllerName];
        return controller;
      } catch (error) {
        winston.error(error);
      }
    }
  };


  /**
   * getControllers
   * すべてのコントローラーを返す
   */
  Controllers.prototype.getControllers = function(_options) {
    return _controllers;
  };


  return Controllers;
})();

module.exports = new Controllers();




























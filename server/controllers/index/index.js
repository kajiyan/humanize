var IndexController = (function() {
  var router  = require('express').Router();
  var config  = require('config');
  var winston = require('winston');

  var _app;
  var _controllers;

  /**
   * @classdesc This is MyClass.
   * @constructor
   */
  function IndexController() {
    winston.info('[Controllers] IndexController -> constructor');
  }

  /**
   * IndexController#setup
   */
  IndexController.prototype.setup = function(app) {
    winston.info('[Controllers] IndexController -> setup');

    _app = app;
    _controllers = _app.get(config.CONTROLLERS);


    /*
     * endpoint: /
     */
    router.get('/', function(req, res, next) {
      res.render('index.swig.html', { title: 'Express' });
    });
  };

  /**
   * getRouter
   */
  IndexController.prototype.getRouter = function() {
    winston.info('[Controllers] IndexController -> getRouter');
    return router;
  };

  return IndexController;
})();

module.exports = new IndexController();











var Helpers = (function() {
  var fs = require('fs');
  var path = require('path');
  var config = require('config');
  var events = require('events');
  var _ = require('lodash');
  var winston = require('winston');

  var _app;
  var _helpers = {};


  function Helpers(app) {
    winston.info('[Helpers] Helpers');

    _helpers = {};
  }


  Helpers.prototype.setup = function(app) {
    winston.info('[Helpers] setup');

    _app = app;

    return new Promise((resolve, reject) => {
      var include = (helpersList) => {
        for (var i = 0, len = helpersList.length; i < len; i++) {
          var dirs = helpersList[i].split(path.sep),
              dirsLen = dirs.length;

          if (dirs[dirsLen - 1] === 'index.js' && dirs[dirsLen - 2] !== config.HELPERS) {
            var helperName = dirs[dirsLen - 2];

            _helpers[helperName] = require(path.join(config.PATH.HELPERS, helperName));
            
            if (typeof (_helpers[helperName])['setup'] === 'function') {
              _helpers[helperName].setup(_app);
            }
          }
        }

        resolve();
      };


      var fileNum = counter = 0;
      var fileList = [];

      var _getList = function(searchPath) {
        fs.readdir(searchPath, function (error, files) {
          if (error) {
            reject(error);
            return;
          };
          
          fileNum = fileNum === 0 ? files.length : fileNum;
          
          files.map(function (file) {
            return path.join(searchPath, file);
          }).filter(function (file) {
            if(fs.statSync(file).isDirectory()) {
              _getList(file);
            } else {
              return fs.statSync(file).isFile();
            }
          }).forEach(function (file) {
            fileList.push(file);
            counter++;
            if(fileNum === counter) {
              include(fileList);
            }
          });
        });
      };

      _getList(config.PATH.HELPERS);
    });
  };


  /**
   * getHelper
   * 引数に指定された名前のヘルパーを返す
   *
   * @param {Object} _options
   * @prop {string} [helperName] - 取得するヘルパーの名前
   */
  Helpers.prototype.getHelper = function(_options) {
    var options = _.extend({
      'helperName': null
    }, _options);

    if(options.helperName != null) {
      try {
        var helper = _helpers[options.helperName];
        return helper;
      } catch (error) {
        console.error(error);
      }
    }
  };


  /**
   * getHelpers
   * すべてのヘルパーを返す
   */
  Helpers.prototype.getHelpers = function() {
    return _helpers;
  }


  return Helpers;
})();

module.exports = new Helpers();
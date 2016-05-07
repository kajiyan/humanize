var Utils = (function() {
  var fs = require('fs');
  var path = require('path');
  var config = require('config');
  var _ = require('lodash');
  var validator = require('validator');
  var winston = require('winston');

  var _app;

  function Utils() {
    winston.info('[Helpers] Utils -> constructor');
  }

  Utils.prototype.setup = function(app) {
    winston.info('[Helpers] Utils -> setup');
    _app = app;
  };

  Utils.prototype.isArray = function(target) {
    return target instanceof Array;
  };

  Utils.prototype.isObject = function(target) {
    return Object.prototype.toString.call(target) === '[object Object]';
  };

  /**
   * Utils#addRequires
   * 引数 _options.fileList に指定されたファイルの配列をすべてrequire する
   *
   * @param {Object} _options
   * @prop {string} _options.fileList - requireするファイルパスの配列
   * @prop {string} _options.matchFileName - 
   * @prop {string} _options.matchDirPath - 
   * @return {Promise}
   */
  Utils.prototype.addRequires = function(_options) {
    winston.info('[Helpers] Utils -> addRequires');

    var options = _.extend({
      'fileList': [],
      'matchFileName': '',
      'matchDirName': '',
      'incrudeTarget': null
    }, _options);

    return new Promise((resolve, reject) => {
      if (
        this.isObject(options.incrudeTarget) &&
        this.isArray(options.fileList) && 
        validator.isLength(options.matchFileName, { min: 1, max: undefined }) &&
        validator.isLength(options.matchDirName, { min: 1, max: undefined })
      ) {
        for (var i = 0, len = options.fileList.length; i < len; i++) {
          var dirs = options.fileList[i].split(path.sep),
              dirsLen = dirs.length;

          if (
            dirs[dirsLen - 1] === options.matchFileName &&
            dirs[dirsLen - 2] !== options.matchDirName
          ) {
            var name = dirs[dirsLen - 2];

            options.incrudeTarget[name] = require(options.fileList[i]);
          }
        }

        resolve();
      } else {
        reject(new Error({ message: 'Utils#addRequires BudQuery'}));
      }
    });
  };

  /**
   * Utils#getFileList
   * 引数 _options.dirPathに指定された
   * ディレクトリ以下にあるファイルのパスを配列にして返す
   *
   * @param {Object} _options
   * @prop {string} _options.dirPath - 探索するディレクトリ
   * @return {Promise} -
   *    resolveであればファイルパスの配列を返す
   *    rejectであればError Objectを返す
   */
  Utils.prototype.getFileList = function(_options) {
    winston.info('[Helpers] Utils -> getFileList');

    var options = _.extend({
      'dirPath': process.cwd()
    }, _options);

    return new Promise((resolve, reject) => {
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
            if  (fs.statSync(file).isDirectory()) {
              _getList(file);
            } else {
              return fs.statSync(file).isFile();
            }
          }).forEach(function (file) {
            fileList.push(file);
            counter++;

            if (fileNum === counter) {
              resolve(fileList);
            }
          });
        });
      };
      
      _getList(options.dirPath);
    });
  };

  return Utils;
})();

module.exports = new Utils();
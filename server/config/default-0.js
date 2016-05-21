var fs = require('fs');
var path = require('path');
var defer = require('config/defer').deferConfig;

module.exports = (function() {
  var result = {};

  // フォルダ名関係
  result.MODELS = 'models';
  result.VIEWS = 'views';
  result.CONTROLLERS = 'controllers';
  result.SOCKETS = 'sockets';
  result.ROUTERS = 'routers';
  result.HELPERS = 'helpers';


  // パス関係
  result.PATH = {};
  result.PATH.ROOT_DIRECTORY = process.cwd();

  result.PATH.MODELS = path.join(result.PATH.ROOT_DIRECTORY, result.MODELS);
  result.PATH.VIEWS = path.join(result.PATH.ROOT_DIRECTORY, result.VIEWS);
  result.PATH.CONTROLLERS = path.join(result.PATH.ROOT_DIRECTORY, result.CONTROLLERS);
  result.PATH.SOCKETS = path.join(result.PATH.ROOT_DIRECTORY, result.SOCKETS);
  result.PATH.ROUTERS = path.join(result.PATH.ROOT_DIRECTORY, result.ROUTERS);
  result.PATH.HELPERS = path.join(result.PATH.ROOT_DIRECTORY, result.HELPERS);

  result.EXPRESS_PORT = 8080;

  // データベース関係
  result.database = {};
  result.database.host = 'localhost';
  result.database.user = 'root';
  result.database.password = 'root';
  result.database.database = 'humanize';
  result.database.port = 8889;
  result.database.connectionLimit = 10;

  // socket.ioの名前空間
  result.NAMESPACE_PLAY = 'play';

  return result;
})();
/**
 * Sockets
 * @classdesc コントローラーを管理するクラス
 */
var Sockets = (function() {
  var config = require('config');
  var winston = require('winston');

  var _app,
      _sockets = {},
      _socketIO;

  /**
   * Sockets constructor
   * @constructor
   */
  function Sockets() {
    winston.info('[Sockets] constructor');
  }


  /**
   * Sockets#setup
   * config.PATH.Sockets 以下にあるコントローラーファイルをすべて読み込む
   */
  Sockets.prototype.setup = function(app) {
    winston.info('[Sockets] setup');

    _app = app;
    _socketIO = _app.get('socketIO');
    _playSocketIO = _socketIO.of(config.NAMESPACE_PLAY);


    _playSocketIO.on('connection', function(socket) {
      console.log('connection');
      
      // ユーザーがディスプレイ上のキーボードを押したタイミングに通知される
      socket.on('keyPush', function(e) {
        e.id = socket.id;
        
        socket
          .broadcast
          .emit('keyPushed', e);
        
        console.log('Socket Event | keyPush', e);
      });

    });

    var helpers = _app.get(config.HELPERS),
        util = helpers.getHelper({ helperName: 'util' });

    return new Promise((resolve, reject) => {
      util.
        getFileList({ dirPath: config.PATH.SOCKETS }).
        then(
          (_fileList) => {
            return util.addRequires({
              fileList: _fileList,
              matchFileName: 'index.js',
              matchDirName: config.SOCKETS,
              incrudeTarget: _sockets
            })
          },
          (error) => {
            winston.error(error);
          }
        ).
        then(
          () => {
            resolve();
          }
        );
    });
  };

  /**
   * getSocket
   * 引数に指定された名前のコントローラを返す
   *
   * @param {Object} _options
   * @prop {string} [_options.socketName] - 取得するソケットの名前
   */
  Sockets.prototype.getSocket = function(_options) {
    var options = _.extend({
      'socketName': null
    }, _options);

    if(options.socketName != null) {
      try {
        var sockets = _sockets[options.socketName];
        return sockets;
      } catch (error) {
        winston.error(error);
      }
    }
  };


  /**
   * getSockets
   * すべてのソケットモジュールを返す
   */
  Sockets.prototype.getSockets = function(_options) {
    return _sockets;
  };


  return Sockets;
})();

module.exports = new Sockets();




























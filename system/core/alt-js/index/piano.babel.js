// --------------------------------------------------
(function(global) {
  /**
   * @classdesc
   * @constructor
   *
   * @param {Object} keyData - 必須項目のオブジェクト
   * @prop {createjs.Stage} keyData.stage - createjs Stageクラスのインスタンスを指定する
   *
   */

  var slice = [].slice;
  createjs.Sound.alternateExtensions = ['mp3'];

  function Piano(keyData, options) {
    console.log('[Piano]', keyData, options);

    this.keyData = keyData;

    if (typeof options === 'undefined' || options === null) options = {};
    
    var defaults = {
      width: this.keyData.stage.canvas.width,
      height: this.keyData.stage.canvas.height,
      octaveNum: 1
    };

    for (var key in defaults) {
      if (options[key] == null) options[key] = defaults[key];
    }

    this.options = options;

    // 全体を包括するコンテナ
    this.pianoContainer = new createjs.Container();
    
    // 黒鍵
    this.blackKeys = [];
    // 白鍵
    this.whiteKeys = [];

    return this;
  }

  /**
   * Piano#on
   */
  Piano.prototype.on = function(event, callback) {
    if (this._callbacks == null) {
      this._callbacks = {};
    }
    
    var events = event.split(' ');

    for (var i = 0, len = events.length; i < len; i++) {
      var base,
          name = events[i];
      (base = this._callbacks)[name] || (base[name] = []);
      this._callbacks[name].push(callback);
    }

    return this;
  }

  /**
   * Piano#once
   */
  Piano.prototype.once = function(event, callback) {
    this.on(event, function() {
      this.off(event, arguments.callee);
      return callback.apply(this, arguments);
    });
    return this;
  }

  /**
   * Piano#trigger
   */
  Piano.prototype.trigger = function() {
    var args = 1 <= arguments.length ? slice.call(arguments, 0) : [],
        event = args.shift(),
        list = this._callbacks != null ? this._callbacks[event] : void 0;

    if (!list) return;

    for (var i = 0, len = list.length; i < len; i++) {
      var callback = list[i];
      if (callback.apply(this, args) === false) break;
    }
    return this;
  };

  /**
   * Piano#off
   */
  Piano.prototype.off = function(event, callback) {
    if (!event) {
      this._callbacks = {};
      return this;
    }

    var events = event.split(' ');
    
    for (var i = 0, len0 = events.length; i < len0; i++) {
      var name = events[i]
          list = this._callbacks != null ? this._callbacks[name] : void 0;
      
      if (list) {
        if (callback) {
          for (var j = k = 0, len1 = list.length; k < len1; j = ++k) {
            cb = list[j];
            if (!(cb === callback)) {
              continue;
            }
            list = list.slice();
            list.splice(j, 1);
            this._callbacks[name] = list;
          }
        } else {
          delete this._callbacks[name];
        }
      }
    }
    return this;
  };


  /**
   * Piano#setup
   */
  Piano.prototype.setup = function() {
    console.log('[Piano] setup');

    const BLACK_KEY_NUM = 5;
    const BLACK_KEY_CODE = ['C#', 'D#', 'F#', 'G#', 'A#'];
    const WHITE_KEY_NUM = 7;
    const WHITE_KEY_CODE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    var octaveWidth = this.keyData.stage.canvas.width / this.options.octaveNum;
    var whiteKeyWidth = ~~(0.5 + (octaveWidth / WHITE_KEY_NUM));
    var whiteKeyHeight = 300;
    var blackKeyWidth = ~~(whiteKeyWidth * 0.6);
    var blackKeyHeight = ~~(whiteKeyHeight * 0.6);

    var manifest = [
      { id: 'O0_C',  src: 'sounds/piano/O0-C.ogg' },
      { id: 'O0_D',  src: 'sounds/piano/O0-D.ogg' },
      { id: 'O0_E',  src: 'sounds/piano/O0-E.ogg' },
      { id: 'O0_F',  src: 'sounds/piano/O0-F.ogg' },
      { id: 'O0_G',  src: 'sounds/piano/O0-G.ogg' },
      { id: 'O0_A',  src: 'sounds/piano/O0-A.ogg' },
      { id: 'O0_B',  src: 'sounds/piano/O0-B.ogg' },
      { id: 'O0_C#', src: 'sounds/piano/O0-C#.ogg' },
      { id: 'O0_D#', src: 'sounds/piano/O0-D#.ogg' },
      { id: 'O0_F#', src: 'sounds/piano/O0-F#.ogg' },
      { id: 'O0_G#', src: 'sounds/piano/O0-G#.ogg' },
      { id: 'O0_A#', src: 'sounds/piano/O0-A#.ogg' }
    ];
    var loadQueue = new createjs.LoadQueue();
    loadQueue.installPlugin(createjs.Sound);
    loadQueue.setMaxConnections(1);

    loadQueue.addEventListener('progress', function(e) {

    });

    loadQueue.addEventListener('complete', function(e) {

    });

    loadQueue.addEventListener('error', function(e) {
      // キューに追加されているローディング中のアイテムをすべて停止し、キューをクリアする
      loadQueue.removeAll();
    });

    // loadQueue.loadManifest(manifest);


    for (var octaveIndex = 0; octaveIndex < this.options.octaveNum; octaveIndex++) {
      // 1オクターブを包括するコンテナ
      var octaveContainer = new createjs.Container();

      for (var whiteKeyIndex = 0; whiteKeyIndex < WHITE_KEY_NUM; whiteKeyIndex++) {
        var whiteKey = new createjs.Shape();
        var whiteKeyOffsetX = octaveWidth * octaveIndex;

        // 白鍵を描画する
        whiteKey.
          graphics.
          setStrokeStyle(1) .
          beginStroke('#5a5a5a').
          beginFill('#ffffff').
          drawRect(whiteKeyOffsetX + (whiteKeyWidth * whiteKeyIndex), 0, whiteKeyWidth, whiteKeyHeight);

        // イベントリスナーを登録する
        whiteKey.addEventListener('click', (function(_this) {
          var keyCode = 'O' + octaveIndex + '_' + WHITE_KEY_CODE[whiteKeyIndex];

          return function(e) {
            _this.trigger('keyBoardPress', {
              'keyCode': keyCode
            });
          };
        })(this));

        // 鍵盤をコンテナーに入れる
        octaveContainer.addChild(whiteKey);
      }

      for (var blackKeyIndex = 0; blackKeyIndex < BLACK_KEY_NUM; blackKeyIndex++) {
        var skip = blackKeyIndex >= 2 ? 2 : 1,
            blackKey = new createjs.Shape(),
            blackKeyOffsetX = octaveWidth * octaveIndex + (whiteKeyWidth * skip) - (blackKeyWidth / 2);

        // 黒鍵を描画する
        blackKey.
          graphics.
          setStrokeStyle(1) .
          beginStroke('#5a5a5a').
          beginFill('#ffffff').
          drawRect(blackKeyOffsetX + (whiteKeyWidth * blackKeyIndex), 0, blackKeyWidth, whiteKeyHeight);

        // イベントリスナーを登録する
        blackKey.addEventListener('click', (function(_this) {
          var keyCode = BLACK_KEY_CODE[blackKeyIndex];

          return function(e) {
            _this.trigger('keyBoardPress', {
              'keyCode': keyCode
            });
          };
        })(this));

        // 鍵盤をコンテナーに入れる
        octaveContainer.addChild(blackKey);
      }


      // 1オクターブ分の鍵盤をコンテナーに入れる
      this.pianoContainer.addChild(octaveContainer);
    }
    this.keyData.stage.addChild(this.pianoContainer);
  };

  /**
   * Piano#drawPiano
   */
  Piano.prototype.drawPiano = function() {
    console.log('[Piano] drawPiano');
  };


  if ('process' in global) {
    module.exports = Piano;
    return;
  }

  global.Piano = Piano;

})((this || 0).self || global);




















import setting from '../../../setting.babel';

require('./piano');


(function() {
  'use strict';


  const SETTING = setting(BUILD_MODE);
  const IS_RETINA_SUPPORT = false;


  document.addEventListener('DOMContentLoaded', function() {
    var elApp = document.querySelector('#js-app');

    // ==================================================
    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth * (IS_RETINA_SUPPORT ? window.devicePixelRatio : 1);
    canvas.height = window.innerHeight * (IS_RETINA_SUPPORT ? window.devicePixelRatio : 1);
    canvas.style.width = '100%';
    canvas.style.backgroundColor = '#cccccc';
    canvas.className = 'piano-canvas';
    elApp.appendChild(canvas);

    // --------------------------------------------------
    /*
     * Create JS
     */
    var stage = new createjs.Stage(canvas);

    // 画面更新の頻度を60FPSに設定
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // タッチデバイスに対応させる
    if (createjs.Touch.isSupported() == true) {
      createjs.Touch.enable(stage); // タッチ操作を有効にする
    }

    // 画面の解像度に合わせる
    stage.scaleX = stage.scaleY = (IS_RETINA_SUPPORT ? window.devicePixelRatio : 1);


    var socket = io.connect(`${SETTING.SOCKET_URL}play`);
    
    socket.on('connect', function() {
      console.log('connected');
    });

    socket.on('keyPushed', function(e) {
      console.log(e);
    });


    var piano = new Piano(
      {
        stage: stage
      },
      {
        width: canvas.width,
        height: canvas.height,
        octaveNum: 2
      }
    );
    piano.setup();

    piano.on('keyBoardPress', function(e) {
      console.log(e);
      socket.emit('keyPush', e);
    });


    createjs.Ticker.on('tick', function () {
      stage.update();
    });

  }, false);
})();










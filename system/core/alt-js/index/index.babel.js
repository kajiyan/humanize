import device from 'device.min';
import setting from '../../../setting.babel';

require('velocity-animate/velocity.min');
require('velocity-animate/velocity.ui.min');
require('./piano');


(function() {
  'use strict';

  console.log(BUILD_MODE);

  const SETTING = setting(BUILD_MODE);
  const IS_RETINA_SUPPORT = false;

  document.addEventListener('DOMContentLoaded', function() {
    var elPiano = document.querySelector('#js-piano');
    var $intro = $('#js-intro');
    var $introLoading = $('#js-intro-loading');
    var $introLoadingPercentage = $('#js-intro-loading--percentage');
    var $introLoadingProgress = $('#js-intro-loading--progress');
    var $introEnsemble = $('#js-intro-ensemble');
    var $introEnsembleButton = $('#js-intro-ensemble__button');

    // ==================================================
    var canvas = document.createElement('canvas');
    // canvas.width = window.innerWidth * (IS_RETINA_SUPPORT ? window.devicePixelRatio : 1);
    canvas.width = 1080;
    canvas.height = window.innerHeight * (IS_RETINA_SUPPORT ? window.devicePixelRatio : 1);
    // canvas.style.width = '100%';
    // canvas.style.backgroundColor = '#cccccc';
    canvas.className = 'piano-canvas';
    elPiano.appendChild(canvas);

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


    var piano = new Piano(
      {
        stage: stage
      },
      {
        width: canvas.width,
        height: canvas.height,
        octaveNum: 2,
        octaveOffset: 3
      }
    );
    piano.setup();

    piano.on('keyBoardPress', function(e) {
      console.log(e);
      socket.emit('keyPush', e);
    });

    piano.on('progress', function(e) {
      var progress = ~~(e.progress * 100);
      $introLoadingPercentage.text(progress);
      $introLoadingProgress.css('width', `${progress}%`);
    });


    piano.on('complete', function(e) {
      // ローディングバー
      Velocity(
        $introLoading,
        {
          opacity: 0.0,
          translateY: -20
        },
        {
          duration: 800,
          easing: 'ease',
          complete: (function(_this) {
            return function() {
              Velocity(
                $introEnsemble,
                {
                  opacity: 1.0,
                  translateY: 0
                },
                {
                  duration: 800,
                  easing: 'ease',
                  complete: (function(_this) {
                    return function() {
                      $introEnsembleButton.prop('disabled', false);
                    }
                  })(this)
                }
              );
            }
          })(this)
        }
      );
    });





    // stage.addEventListener('click', function(e) {
    //   alert();
    //   console.log(e);
    // });


    // var socket = io.connect(`${SETTING.SOCKET_URL}play`);
    var socket = io.connect(`http://160.16.230.26:8000/play`);
    
    socket.on('connect', function() {
      console.log('connected');
    });

    socket.on('keyPushed', function(e) {
      console.log(e);
      piano.play(e);
    });


    createjs.Ticker.on('tick', function () {
      stage.update();
    });

    // --------------------------------------------------
    /**
     * Events
     */
    $introEnsemble.on('click', function(e) {
      Velocity(
        $intro,
        {
          opacity: 0.0,
        },
        {
          duration: 800,
          easing: 'ease',
          display: 'none'
        }
      );
    });

  }, false);
})();










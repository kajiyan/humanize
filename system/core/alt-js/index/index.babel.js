import setting from '../../../setting.babel';

(function() {
  'use strict';

  const SETTING = setting(BUILD_MODE);


  document.addEventListener('DOMContentLoaded', function() {
    var socket = io.connect(`${SETTING.SOCKET_URL}play`);
  }, false);
})();
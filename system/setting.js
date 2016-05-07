'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? { mode: 'DEBUG_LOCAL' } : arguments[0];

  var result = {};

  var defaults = { mode: 'DEBUG_LOCAL' };

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      defaults[key] = options[key];
    }
  }

  result.MODE = defaults.mode.toUpperCase();

  var PRODUCTION_PROTOCOL = 'http';
  var PRODUCTION_HOST = 'humanize.com';
  var PRODUCTION_PORT = 80;
  var PRODUCTION_SOCKET_HOST = '';
  var PRODUCTION_SOCKET_PORT = 10022;

  var DEBUG_PROTOCOL = 'http';
  var DEBUG_HOST = 'humanize.hirokikajiya.com';
  var DEBUG_PORT = 80;
  var DEBG_SOCKET_HOST = 'humanize.hirokikajiya.com';
  var DEBG_SOCKET_PORT = 10022;

  var DEBUG_LOCAL_PROTOCOL = 'http';
  var DEBUG_LOCAL_HOST = 'localhost';
  var DEBUG_LOCAL_PORT = 8880;
  var DEBUG_LOCAL_SOCKET_HOST = 'localhost';
  var DEBUG_LOCAL_SOCKET_PORT = 10022;

  result.COMMON = 'common';
  result.IMAGES = 'images';
  result.CSS = 'css';
  result.JS = 'js';
  result.FONT = 'fonts';
  result.AUDIO = 'audio';
  result.VIDEO = 'video';

  var urlSet = {
    PRODUCTION: function PRODUCTION() {
      result.FB_APP_ID = '000000000000000';
      result.GA_ID = 'UA-00000000-0';
      result.HOST = PRODUCTION_HOST;
      result.PORT = PRODUCTION_PORT;
      result.BASE_URL = PRODUCTION_PROTOCOL + '://' + PRODUCTION_HOST + '/';
      result.BASE_PATH = '';
      result.COMMON_BASE_PATH = '/' + result.COMMON + '/';
      result.SOCKET_HOST = PRODUCTION_SOCKET_HOST;
      result.SOCKET_PORT = PRODUCTION_SOCKET_PORT;
    },
    DEBUG: function DEBUG() {
      result.FB_APP_ID = '000000000000000';
      result.GA_ID = 'UA-00000000-0';
      result.HOST = DEBUG_HOST;
      result.PORT = DEBUG_PORT;
      result.BASE_URL = DEBUG_PROTOCOL + '://' + DEBUG_HOST + '/';
      result.BASE_PATH = '';
      result.COMMON_BASE_PATH = '/' + result.COMMON + '/';
      result.SOCKET_HOST = DEBG_SOCKET_HOST;
      result.SOCKET_PORT = DEBG_SOCKET_PORT;
    },
    DEBUG_LOCAL: function DEBUG_LOCAL() {
      result.FB_APP_ID = '000000000000000';
      result.GA_ID = 'UA-00000000-0';
      result.HOST = DEBUG_LOCAL_HOST;
      result.PORT = DEBUG_LOCAL_PORT;
      result.BASE_URL = DEBUG_LOCAL_PROTOCOL + '://' + DEBUG_LOCAL_HOST + ':' + DEBUG_LOCAL_PORT + '/';
      result.BASE_PATH = '';
      result.COMMON_BASE_PATH = '/' + result.COMMON + '/';
      result.SOCKET_HOST = DEBUG_LOCAL_SOCKET_HOST;
      result.SOCKET_PORT = DEBUG_LOCAL_SOCKET_PORT;
    }
  };

  try {
    urlSet[result.MODE]();
  } catch (e) {
    return new Error('ビルドモードのオプションは\'PRODUCTION\', \'DEBUG\', \'DEBUG_LOCAL\'である必要があります。');
  }

  if (typeof window !== 'undefined' && window !== null) {
    if (window.location.hostname.indexOf(result.PRODUCTION_HOST) >= 0) {
      window.console = {
        log: function log() {}
      };
      urlSet[result.MODE]('PRODUCTION');
    } else if (window.location.hostname.indexOf(result.DEBUG_HOST) >= 0) {
      urlSet[result.MODE]('DEBUG');
    } else if (window.location.hostname.indexOf(result.DEBUG_LOCAL_HOST) >= 0) {
      urlSet[result.MODE]('DEBUG_LOCAL');
    }

    console.log('Front End Setting | /system/setting.js');
  } else {
    result.PAGES = require('./data/page.json').pages;

    result.SYSTEM = 'system';
    result.SYSTEM_CORE = 'core';
    result.APPLICATION = 'server/public';
    result.DOCS = 'docs';

    result.ROOT = '../';
    result.CORE = result.SYSTEM_CORE + '/';
    result.APPLICATION_DIST = '' + result.ROOT + result.APPLICATION + '/';
    result.DOCS_DIST = '' + result.ROOT + result.DOCS + '/';

    result.COMMANDS = 'commands';
    result.BUILDER = 'gulp';
    result.ENGINE = 'swig';
    result.ENGINE_ATTRIBUTE = 'swig';
    result.STYLE = 'sass';
    result.ALT_JS = 'alt-js';
    result.ALT_JS_ATTRIBUTE = 'babel.js'; // or coffee
    result.COFFEE = 'coffee';
    result.BABEL_ATTRIBUTE = 'babel';

    result.APP_COMPONENTS = 'app_components';
    result.NODE_MODULES = 'node_modules';
    result.BOWER_COMPONENTS = 'bower_components';
  }

  result.COMMON_IMAGES = '' + result.COMMON_BASE_PATH + result.IMAGES + '/';
  result.COMMON_CSS = '' + result.COMMON_BASE_PATH + result.CSS + '/';
  result.COMMON_JS = '' + result.COMMON_BASE_PATH + result.JS + '/';
  result.COMMON_FONT = '' + result.COMMON_BASE_PATH + result.FONT + '/';
  result.COMMON_AUDIO = '' + result.COMMON_BASE_PATH + result.AUDIO + '/';
  result.COMMON_VIDEO = '' + result.COMMON_BASE_PATH + result.VIDEO + '/';
  result.ABSOLUTE_IMAGES = '' + result.BASE_PATH + result.IMAGES + '/';
  result.ABSOLUTE_CSS = '' + result.BASE_PATH + result.CSS + '/';
  result.ABSOLUTE_JS = '' + result.BASE_PATH + result.JS + '/';
  result.ABSOLUTE_FONT = '' + result.BASE_PATH + result.FONT + '/';
  result.ABSOLUTE_AUDIO = '' + result.BASE_PATH + result.AUDIO + '/';
  result.ABSOLUTE_VIDEO = '' + result.BASE_PATH + result.VIDEO + '/';

  result.CONFIG = {};

  return result;
};

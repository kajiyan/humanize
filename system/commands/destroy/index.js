'use strict';

var _setting = require('../../setting');

var _setting2 = _interopRequireDefault(_setting);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND = 'destroy'; /*
                          * コンパイル用 コマンド
                          * $ babel index.babel.js --out-file index.js
                          */

// $ npm run generate -- <DESTROY_DIR_NAME>

var CURRENT_DIRECTORY = process.cwd();
var SETTING = (0, _setting2.default)();
var DESTROY_DIR_NAME = process.argv[2];

var json = _fsExtra2.default.readJSONSync(CURRENT_DIRECTORY + '/data/page.json');
var isEmpty = _lodash2.default.findIndex(json.pages, ['name', DESTROY_DIR_NAME]) < 0;

if (isEmpty) {
  console.error('message: このディレクトリは存在しません');
  process.exit(9);
}

// 削除するディレクトリ名が渡されているか
if (typeof DESTROY_DIR_NAME === 'undefined' || DESTROY_DIR_NAME === null) {
  console.error('message: 削除するディレクトリを指定してください');
  process.exit(9);
}

_fsExtra2.default.removeSync(CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ENGINE + '/' + DESTROY_DIR_NAME);
_fsExtra2.default.removeSync(CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.STYLE + '/' + DESTROY_DIR_NAME);
_fsExtra2.default.removeSync(CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ALT_JS + '/' + DESTROY_DIR_NAME);

json.pages.splice(_lodash2.default.findIndex(json.pages, ['name', DESTROY_DIR_NAME]), 1);
_fsExtra2.default.outputJSONSync(CURRENT_DIRECTORY + '/data/page.json', json);

console.log('\n\n[' + DESTROY_DIR_NAME + ' Directory] Destroy Done!\n\n' + CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ENGINE + '/' + DESTROY_DIR_NAME + '\n' + CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.STYLE + '/' + DESTROY_DIR_NAME + '\n' + CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ALT_JS + '/' + DESTROY_DIR_NAME + '\n\n\nUpdate JSON\n' + CURRENT_DIRECTORY + '/data/page.json\n\n');

'use strict';

var _setting = require('../../setting');

var _setting2 = _interopRequireDefault(_setting);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMAND = 'generate'; /*
                           * コンパイル用 コマンド
                           * $ babel index.babel.js --out-file index.js
                           */

// $ npm run generate -- <GENERATE_DIR_NAME>

var CURRENT_DIRECTORY = process.cwd();
var SETTING = (0, _setting2.default)();
var GENERATE_DIR_NAME = process.argv[2];

var json = _fsExtra2.default.readJSONSync(CURRENT_DIRECTORY + '/data/page.json');
console.log(json);
var isEmpty = _lodash2.default.findIndex(json.pages, ['name', GENERATE_DIR_NAME]) < 0;

if (!isEmpty) {
  console.error('message: 既にディレクトリが生成されています');
  process.exit(9);
}

// 作成するディレクトリ名が渡されているか
if (typeof GENERATE_DIR_NAME === 'undefined' || GENERATE_DIR_NAME === null) {
  console.error('message: 作成するディレクトリを指定してください');
  // プロセスを終了
  process.exit(9);
}

_fsExtra2.default.copySync(CURRENT_DIRECTORY + '/' + SETTING.COMMANDS + '/' + COMMAND + '/templates/html', CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ENGINE + '/' + GENERATE_DIR_NAME);

_fsExtra2.default.copySync(CURRENT_DIRECTORY + '/' + SETTING.COMMANDS + '/' + COMMAND + '/templates/css', CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.STYLE + '/' + GENERATE_DIR_NAME);

_fsExtra2.default.copySync(CURRENT_DIRECTORY + '/' + SETTING.COMMANDS + '/' + COMMAND + '/templates/js', CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ALT_JS + '/' + GENERATE_DIR_NAME);

json.pages.push({
  name: GENERATE_DIR_NAME,
  dir: GENERATE_DIR_NAME + '/'
});

_fsExtra2.default.outputJSONSync(CURRENT_DIRECTORY + '/data/page.json', json);

console.log('\n\n[' + GENERATE_DIR_NAME + ' Directory] Generate Done!\n\n' + CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ENGINE + '/' + GENERATE_DIR_NAME + '\n' + CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.STYLE + '/' + GENERATE_DIR_NAME + '\n' + CURRENT_DIRECTORY + '/' + SETTING.SYSTEM_CORE + '/' + SETTING.ALT_JS + '/' + GENERATE_DIR_NAME + '\n\n\nUpdate JSON\n' + CURRENT_DIRECTORY + '/data/page.json\n\n');

/*
 * コンパイル用 コマンド
 * $ babel index.babel.js --out-file index.js
 */

// $ npm run generate -- <DESTROY_DIR_NAME>

import setting from '../../setting';
import fse from 'fs-extra';
import _ from 'lodash';

const COMMAND = 'destroy';
const CURRENT_DIRECTORY = process.cwd();
const SETTING = setting();
const DESTROY_DIR_NAME = process.argv[2];


var json = fse.readJSONSync(`${CURRENT_DIRECTORY}/data/page.json`);
var isEmpty = _.findIndex(json.pages, ['name', DESTROY_DIR_NAME]) < 0;


if (isEmpty) {
  console.error('message: このディレクトリは存在しません');
  process.exit(9);
}

// 削除するディレクトリ名が渡されているか
if (typeof DESTROY_DIR_NAME === 'undefined' || DESTROY_DIR_NAME === null) {
  console.error('message: 削除するディレクトリを指定してください');
  process.exit(9);
}


fse.removeSync(`${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ENGINE}/${DESTROY_DIR_NAME}`);
fse.removeSync(`${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.STYLE}/${DESTROY_DIR_NAME}`);
fse.removeSync(`${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ALT_JS}/${DESTROY_DIR_NAME}`);




json.pages.splice(_.findIndex(json.pages, ['name', DESTROY_DIR_NAME]), 1);
fse.outputJSONSync(`${CURRENT_DIRECTORY}/data/page.json`, json);


console.log(`

[${DESTROY_DIR_NAME} Directory] Destroy Done!

${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ENGINE}/${DESTROY_DIR_NAME}
${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.STYLE}/${DESTROY_DIR_NAME}
${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ALT_JS}/${DESTROY_DIR_NAME}


Update JSON
${CURRENT_DIRECTORY}/data/page.json

`);
/*
 * コンパイル用 コマンド
 * $ babel index.babel.js --out-file index.js
 */

// $ npm run generate -- <GENERATE_DIR_NAME>

import setting from '../../setting';
import fse from 'fs-extra';
import _ from 'lodash';

const COMMAND = 'generate';
const CURRENT_DIRECTORY = process.cwd();
const SETTING = setting();
const GENERATE_DIR_NAME = process.argv[2];


var json = fse.readJSONSync(`${CURRENT_DIRECTORY}/data/page.json`);
var isEmpty = _.findIndex(json.pages, ['name', GENERATE_DIR_NAME]) < 0;


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


fse.copySync(
  `${CURRENT_DIRECTORY}/${SETTING.COMMANDS}/${COMMAND}/templates/html`,
  `${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ENGINE}/${GENERATE_DIR_NAME}`
);

fse.copySync(
  `${CURRENT_DIRECTORY}/${SETTING.COMMANDS}/${COMMAND}/templates/css`,
  `${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.STYLE}/${GENERATE_DIR_NAME}`
);

fse.copySync(
  `${CURRENT_DIRECTORY}/${SETTING.COMMANDS}/${COMMAND}/templates/js`,
  `${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ALT_JS}/${GENERATE_DIR_NAME}`
);


json.pages.push({
  name: GENERATE_DIR_NAME,
  dir: `${GENERATE_DIR_NAME}/`
});

fse.outputJSONSync(`${CURRENT_DIRECTORY}/data/page.json`, json);


console.log(`

[${GENERATE_DIR_NAME} Directory] Generate Done!

${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ENGINE}/${GENERATE_DIR_NAME}
${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.STYLE}/${GENERATE_DIR_NAME}
${CURRENT_DIRECTORY}/${SETTING.SYSTEM_CORE}/${SETTING.ALT_JS}/${GENERATE_DIR_NAME}


Update JSON
${CURRENT_DIRECTORY}/data/page.json

`);
var winston = require('winston');
var expressWinston = require('express-winston');

exports.setting = function(){
  winston.add(winston.transports.File, {
    // 書きだすファイル名です。
    filename: 'log/humanize.log',
    // ログを出力する最低のログレベルです
    level: 'debug',
    // タイムスタンプを追加します
    timestamp: true,
    // JSON形式で出力する場合はtrue。文字列で出力するならfalse。
    json: true,
    // ファイルの最大サイズ（バイト）。これを上回ると新しいファイルが作成されます。例えばmy1.log、my2.logのような新規ファイルが作成されます。
    maxsize: 12800000,
    // 残しておくファイルの数の最大値。この数を上回った場合は、古いファイルから削除されていきます。ログローテート相当の処理が可能です。
    maxFiles: 1,
    colorize: true
  });
};

// -- express-winsto向け設定
exports.settingExpress = function(){
  return expressWinston.logger({
    transports: [
      // new winston.transports.Console({
      //     json: true,
      //     colorize: true,
      //     timestamp: true
      // }),
      new winston.transports.File({
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{req.method}} {{req.url}} {{req.body}} {{req.query}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
        json: true,
        colorize: true,
        timestamp: true,
        maxsize: 12800000,
        maxFiles: 1,
        filename: 'log/humanize-http.log',
      })
    ]
  });
};
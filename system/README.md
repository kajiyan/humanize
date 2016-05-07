# WebTemplate
<br>
<br>



## コマンド一覧
### $ npm run generate -- \<GENERATE\_DIR\_NAME\>
\<GENERATE\_DIR\_NAME\>に指定されたディレクトリ名のディレクトリを system/core 以下の alt-js, sass, swig フォルダ内に構築する。  
また、gulp の監視リスト用のjsonファイル（data/page.json）にその情報が追記される。

<br>
<br>

### $ npm run destroy -- \<DESTROY\_DIR\_NAME\>
\<GENERATE\_DIR\_NAME\>に指定されたディレクトリ名のディレクトリを system/core 以下の alt-js, sass, swig フォルダ内から削除する。  
また、gulp の監視リスト用のjsonファイル（data/page.json）からもその情報が削除される。
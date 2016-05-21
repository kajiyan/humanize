# humanize

### index
* [Original Objects](#original-objects)
	* [Code Object](#original-objects--code)
* [Socket API](#socket-api)
<br>
<br>
<br>
<br>
<br>

---

## Original Objects

### `Code Object`
#### Overview

```js
{
	keyCode: 'O0_C'
}
```

---

<a name="socket-api"></a>
## Socket API

### Namespace `play` : port `8080`
下記のルールでアクセス可能とする
<br>
<br>
**開発環境**
	
	http://localhost:8080

**本番環境**
	
	http://160.16.230.26:8080
	

#### [`Client -> Server`](#io-client-to-server)
* [connect](#io-connect)
* [keyPush](#io-key-push)


#### [`Server -> Client`](#io-server-to-client)
* [keyPushed](#io-key-pushed)

<br>
<br>

<a name="io-client-to-server"></a>
### Client -> Server

---

<a name="io-connect"></a>
### connect

##### Overview
`Client -> Server`

新規ユーザーがWebSocket サーバーとの接続が成功した時に通知される  
Socket 通信を開始する

##### Parameters
```js
```

##### Response (Emit Callback) 
```js
```

###### Server
```js
socketIO.on('connection', function(socket){});
```

###### Client
```js
var socket = io.connect('http://humanize.telenoia.org:10022');
```

<br>
---
<br>

<a name="io-key-push"></a>
### keyPush

##### Overview
`Client -> Server`

ユーザーがディスプレイ上のキーボードを押したタイミングで  
キーに関する情報をWebSocket サーバーへ通知する  
サーバー側は正常にパラメータを受け取ると [keyPushed](#io-key-pushed) を  
broadcastでWebSocket サーバーへ接続しているユーザーへ送信する


##### Parameters
```js
/**
 * @prop {string} keyCode - 押されたキーに対応するコードの文字列
 */
{
	keyCode: 'O0_C'
}
```

##### Response (Emit Callback) 
```js
```

###### Server
```js
```

###### Client
```js
```

<br>
<br>
<br>

<a name="io-server-to-client"></a>
### Server -> Client

---

<a name="io-key-pushed"></a>
### keyPushed

##### Overview
`Server -> Client`

Overview

WebSocket サーバーへクライアントから [keyPush](#io-key-push) が  
通知されたタイミングでbroadcastでクライアントに発信される。  
クライアントへ通知されるオブジェクトは [keyPush](#io-key-push) で受け取った情報にsocket.idを付加したもの。


##### Parameters
```js
```

##### Response
```js
/**
 * @prop {string} id - 新規ユーザーのsocket.id
 * @prop {string} keyCode - 押されたキーに対応するコードの文字列
 */
{
	id: "T16ontoFZG1fx7OpAAAH",
	keyCode: "O0_C"
}
```

###### Server
```js
```

###### Client
```js
```
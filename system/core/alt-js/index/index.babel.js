import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Store, createStore, combineReducers, applyMiddleware, bindActionCreators, compose } from 'redux';

/*
 * conponents
 */
import Howto from './conponents/Howto.babel';
import Drawing from './conponents/Drawing.babel';


const rootReducer = combineReducers({});
const store = createStore(rootReducer, {});


class App extends React.Component {
  render() {
    return (
      <div className="app-inner">
        <Howto />
        <Drawing
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

connect(mapStateToProps, mapDispatchToProps)(App);





(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		console.log('DOMContentLoaded');

    let elApp = document.querySelector('#js-app');

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      elApp
    );

	}, false);
})();
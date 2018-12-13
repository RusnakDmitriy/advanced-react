import React, { Component } from 'react';
import {Provider} from 'react-redux';
import Root from './components/Root';
import store from './redux';
import {ConnectedRouter} from 'react-router-redux';
import history from './history';
import './config';
import './mocks';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <DragDropContextProvider backend={HTML5Backend}>
              <ConnectedRouter history={history}>
                  <Root />
              </ConnectedRouter>
          </DragDropContextProvider>
      </Provider>
    );
  }
}

export default App;

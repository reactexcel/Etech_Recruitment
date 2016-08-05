import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Meteor} from 'meteor/meteor';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import reducer from './reducers/index';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, applyMiddleware, compose } from 'redux'
import {Router , Route, IndexRoute, hashHistory} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Page_ForgotPassword from './containers/ForgotPassword'

export let isMonitorAction;

const logger = createLogger();
injectTapEventPlugin();

Meteor.startup(
  () => {

    let store = createStore(reducer, compose(
      applyMiddleware( logger,thunk),
      window.devToolsExtension ? window.devToolsExtension({
        getMonitor: (monitor) => { isMonitorAction = monitor.isMonitorAction; }
        }) : f => f
      ));
    
    ReactDOM.render(
      <MuiThemeProvider>
        <Provider store={store}>
          <Router history={hashHistory} >
            <Route path="/" >
              <Route path="forgotpassword" component={Page_ForgotPassword} />
            </Route>  
          </Router>
        </Provider>
      </MuiThemeProvider>, document.getElementById('app-container'));
  }
);

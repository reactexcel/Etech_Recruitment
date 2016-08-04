import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Meteor} from 'meteor/meteor';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import reducer from './reducers/index.jsx';
import { Accounts } from 'meteor/accounts-base';
import invariant from 'redux-immutable-state-invariant';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {registerContainer} from './containers'
import { createStore, applyMiddleware, compose } from 'redux'
import {Router , Route, IndexRoute,browserHistory, hashHistory} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export let isMonitorAction;

const logger = createLogger();
injectTapEventPlugin();

Meteor.startup(
  () => {
    let store = createStore(reducer,Immutable.Map({}),compose(
      applyMiddleware(invariant(), logger,thunk),
      window.devToolsExtension ? window.devToolsExtension({
        getMonitor: (monitor) => { isMonitorAction = monitor.isMonitorAction; }
        }) : f => f
      ));

    ReactDOM.render(
      <MuiThemeProvider>
        <Provider store={store}>
        <Router history={browserHistory}>
        <Route path="/" component={registerContainer}></Route>
          
        </Router>
        </Provider>
      </MuiThemeProvider>, document.getElementById('app-container'));
  }
);

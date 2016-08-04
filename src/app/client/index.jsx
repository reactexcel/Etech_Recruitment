import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Meteor} from 'meteor/meteor';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import reducer from './reducers/index.jsx';
import invariant from 'redux-immutable-state-invariant';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, applyMiddleware, compose } from 'redux'
import {Router , Route, IndexRoute, hashHistory, browserHistory} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginContainer from './containers/Login';

export let isMonitorAction;

const logger = createLogger();
injectTapEventPlugin();


//console.log('aaaa')
//console.log( reducer )

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
            <Route path="/" component={LoginContainer}></Route>
          </Router>
        </Provider>
      </MuiThemeProvider>, document.getElementById('app-container'));
  }
);

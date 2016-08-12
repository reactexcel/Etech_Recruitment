import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Meteor} from 'meteor/meteor';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import reducer from './reducers/index';
import { Accounts } from 'meteor/accounts-base';
import invariant from 'redux-immutable-state-invariant';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {RegisterContainer} from './containers';
import { createStore, applyMiddleware, compose } from 'redux'
import {Router , Route, IndexRoute, hashHistory, browserHistory} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginContainer from './containers/Login';
import ConfigurationContainer from './containers/configurationContainer';
import EmailSettingContainer from './containers/configurationContainer/emailSetting';
import AppContainer from './containers';
import Page_ForgotPassword from './containers/ForgotPassword'
import Page_Home from './containers/Home'
import Page_Inbox from './containers/Inbox'
import DisplayContainer from './containers/displayLogs'
import LogsContainer from './containers/displayLogs/logs'
import EmailbodyContainer from './containers/emailBodyContainer'
import InboxTagContainer from './containers/configurationContainer/inboxTagContainer'

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
          <Router history={hashHistory}>
            <Route path="/" component={AppContainer}>
              <IndexRoute component={LoginContainer} />
              <Route path="home" component={Page_Home}></Route>
              <Route path="login" component={LoginContainer}></Route>
              <Route path="register" component={RegisterContainer}></Route>
              <Route path="forgotpassword" component={Page_ForgotPassword}> </Route>
              <Route path="/config" component={ConfigurationContainer}>
                <Route path="/config/email-server-setting" component={EmailSettingContainer}></Route>
                <Route path="/config/inbox-tag-setting" component={InboxTagContainer}></Route>
              </Route>
              <Route path="inbox" component={Page_Inbox}></Route>
              <Route path="/display" component={DisplayContainer}>
                 <Route path="/display/logs" component={LogsContainer}></Route>
              </Route>
              <Route path="emailbody/:id" component={EmailbodyContainer}></Route>
            </Route>
          </Router>
        </Provider>
      </MuiThemeProvider>, document.getElementById('app-container'));
  }
);

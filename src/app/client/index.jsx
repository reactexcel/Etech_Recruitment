import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Meteor} from 'meteor/meteor';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import reducer from './reducers/index';
import { Accounts } from 'meteor/accounts-base';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {RegisterContainer} from './containers';
import { createStore, applyMiddleware, compose } from 'redux'
import {Router , Route, IndexRoute, hashHistory, browserHistory} from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginContainer from './containers/Login';
import ConfigurationContainer from './containers/configurationContainer';
import EmailSettingContainer from './containers/configurationContainer/emailSetting';
import EmailSendingContainer from './containers/configurationContainer/emailSending';
import AppContainer from './containers';
import Page_ForgotPassword from './containers/ForgotPassword'
import ChangePasswordContainer from './containers/changePassword'
import DashboardContainer from './containers/dashboard'
import Page_Home from './containers/Home'
import Page_Inbox from './containers/Inbox'
import DisplayContainer from './containers/displayLogs'
import LogsContainer from './containers/displayLogs/logs'
import EmailbodyContainer from './containers/emailBodyContainer'
import InboxTagContainer from './containers/configurationContainer/inboxTagContainer'
import InboxDynamicActionContainer from './containers/configurationContainer/inboxDynamicActionContainer'
import SendMails from './containers/sendmailContainer'
import VariablesContainer from './containers/variables'
import ManageUsersContainer from './containers/manageUsers'

export let isMonitorAction;

const logger = createLogger();
injectTapEventPlugin();

Meteor.startup(
  () => {
    let store = createStore(reducer,Immutable.Map({}),compose(
      applyMiddleware(thunk, logger),
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
              <Route path="changepassword" component={ChangePasswordContainer}></Route>
              <Route path="dashboard" component={DashboardContainer}></Route>
              <Route path="/config" component={ConfigurationContainer}>
                <Route path="/config/email-server-setting" component={EmailSettingContainer}></Route>
                <Route path="/config/tag-setting" component={InboxTagContainer}></Route>
                <Route path="/config/dynamic-actions" component={InboxDynamicActionContainer}></Route>
                <Route path="/config/email-sending" component={EmailSendingContainer}></Route>
                <Route path="/config/email-templates" component={SendMails}></Route>
                <Route path="/config/variables" component={VariablesContainer}></Route>
                <Route path="/config/manageUsers" component={ManageUsersContainer}></Route>
              </Route>
              <Route path="inbox" component={Page_Inbox}></Route>
                <Route path="inbox/:nav" component={Page_Inbox}></Route>
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

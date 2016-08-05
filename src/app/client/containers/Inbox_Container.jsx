import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router'
 
import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Inbox from '../components/Inbox'
//import {registerUser} from '../actions'


class Inbox_Container extends React.Component {
  constructor(props){
    super(props);
    
  }
  getChildContext() {
      return { muiTheme: getMuiTheme(baseTheme) };
  }

  render() {

      return (
            <Inbox 
              router={this.props.router}  
              onRegisterUser={this.props.registerUser}
            />
         
      )
  }
}

Inbox_Container.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};


function mapStateToProps(state,props){
  state = state.toJS()    
  return {
    users: state
  }
}
const mapDispatchToProps = (dispatch) => {   //es6 way
     return {
        registerUser: (email, name, password) => {
            return dispatch(registerUser(email, name, password))
        }
     }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Inbox_Container))
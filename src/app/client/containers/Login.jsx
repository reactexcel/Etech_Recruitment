import React from 'react';
import Login from './../components/Login';
import * as all_actions from './../actions/users/index';
import { connect } from 'react-redux';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {withRouter} from 'react-router'
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class LoginContainer extends React.Component{
      constructor(props){
		super(props);
	}
	getChildContext() {
      return { 
      	muiTheme: getMuiTheme(baseTheme) 
      };
  }
  render(){
		return(
			<Login 
			router={this.props.router} 
			ui={this.props.ui} 
			onLogin={this.props.login}/>
			);
	}
}
LoginContainer.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
function mapStateToProps(state,props){
  state = state.toJS()    
  return {
    ui: state.ui
  }
}
const mapDispatchToProps=(dispatch)=>{
	return{
		login:(email,password)=>{
			return dispatch(all_actions.loginUser(email,password));
		}
	}
}
export default withRouter(connect(
mapStateToProps,
mapDispatchToProps
)(LoginContainer))
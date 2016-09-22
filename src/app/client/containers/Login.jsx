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
	  /*getChildContext() {
         return { 
      	    muiTheme: getMuiTheme(baseTheme) 
         };
     }*/
     render(){
		return(
			<div className="container" style={{'paddingTop':'20px'}}>
            <div className="row">
             <Login 
			   router={this.props.router} 
			   ui={this.props.ui} 
			   onLogin={this.props.login}/>
            </div>
            </div>
			   
			   
			);
	 }
}
/*LoginContainer.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};*/
function mapStateToProps(state,props){
  state = state.toJS()  

  return {
    ui: state.ui
  }
}
const mapDispatchToProps=(dispatch)=>{
	return{
		login:(email,password,rememeberMe)=>{
			return dispatch(all_actions.loginUser(email,password,rememeberMe));
		}
	}
}
export default withRouter(connect(
mapStateToProps,
mapDispatchToProps
)(LoginContainer))
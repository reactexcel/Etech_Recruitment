import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as actions_forgotpassword from './../actions/forgotpassword/forgotpassword'
import ForgotPasswordForm from './../components/forgotpassword/ForgotPasswordForm'

class ForgotPassword extends React.Component {
    constructor( props ){
        super( props );
    }
    componentWillMount(){
      if (Meteor.userId()) {
       this.props.router.push('/inbox');
      }
    }
    getChildContext() {
      return { muiTheme: getMuiTheme(baseTheme) };
    }
    render(){
        return(
        	<div>
        		<ForgotPasswordForm 
                    doForgotPassword={this.props.onForgotPassword} 
                    status_message={this.props.forgotpassword.status } 
                />
        	</div>
        )
    }
}

ForgotPassword.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};


function mapStateToProps( state ){
    return {
		forgotpassword : state.toJS().entities.forgotpassword
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    	onForgotPassword : ( emailid ) => {
			return dispatch( actions_forgotpassword.forgot_password( emailid ))
        }
    }
}

const VisibleForgotPassword = connect(
  mapStateToProps,
  mapDispatchToProps
)( ForgotPassword )

const RouterVisibleForgotPassword = withRouter( VisibleForgotPassword )

export default RouterVisibleForgotPassword
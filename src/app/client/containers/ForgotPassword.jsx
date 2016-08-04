import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import * as actions_forgotpassword from './../actions/forgotpassword/forgotpassword'

import ForgotPasswordForm from './../components/forgotpassword/ForgotPasswordForm'

class ForgotPassword extends React.Component {
    constructor( props ){
        super( props );
        this.doForgotPassword = this.doForgotPassword.bind( this )
    }
    componentWillReceiveProps( props ){
    }
    doForgotPassword( emailid ){
    	this.props.onForgotPassword( emailid )
    }
    render(){
        return(
        	<div>
        		<ForgotPasswordForm doForgotPassword={this.doForgotPassword} />
        	</div>
        )
    }
}
function mapStateToProps( state ){
	return {
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
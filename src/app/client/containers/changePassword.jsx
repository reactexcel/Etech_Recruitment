import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import { changePassword } from '../actions/changePassword'
import Header from './../components/generic/Header'
import ChangePassword from './../components/changePassword'



class ChangePasswordContainer extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        if (!Meteor.userId()) {
        this.props.router.push('/login');
        }       
    }   

    render(){
        return(
        	<div>
                <Header {...this.props} position={0} altr={"Change Password"}/>
                <ChangePassword  {...this.props} />
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        emailTemplates : state.entities.emailTemplates,
       }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onChangePassword : (oldpass,newpass) => {
            return dispatch(changePassword( oldpass, newpass ))
        }
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( ChangePasswordContainer ))

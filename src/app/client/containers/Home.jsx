import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'
import Header from './../components/generic/Header'

import * as actions_emailsstore from './../actions/emailsstore'

class Home extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        this.props.onUpdateEmailsStore()
    }
    componentWillReceiveProps( props ){
    }
    render(){
        return(
        	<div>
             <Header {...this.props} position={1}/>
             
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
     	onUpdateEmailsStore : ( emailid ) => {
            return dispatch( actions_emailsstore.update_emails_store( ) )
        }
    }
}

const VisibleHome = connect(
  mapStateToProps,
  mapDispatchToProps
)( Home )

const RouterVisibleHome = withRouter( VisibleHome )

export default RouterVisibleHome
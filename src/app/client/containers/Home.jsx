import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import * as actions_emailsstore from './../actions/emailsstore'

class Home extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        this.props.onUpdateEmailsStore()
    }
    componentWillReceiveProps( props ){
    }
    render(){
        return(
        	<div>
        		Home
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
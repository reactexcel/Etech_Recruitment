import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import * as actions_inbox from './../actions/inbox'
import * as actions_emailSetting from './../actions/emailSetting'

import Header from './../components/generic/Header'
import SendEmail from './../components/sendmail'



class SendMails extends React.Component {
    constructor( props ){
        super( props )
        this.state = {
        }
    }
    componentWillMount(){
    }
    componentWillReceiveProps( props ){

    }
    componentDidUpdate(){
 
    }

    render(){
        return(
        	<div>
                <Header {...this.props} position={1}/>
                <SendEmail {...this.props} />
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        inbox : state.entities.inbox,
        emailSetting : state.entities.emailSetting,
        tags : state.entities.inboxTag.sort(function(a, b){let x=a.name.localeCompare(b.name); if(x==1)return(1);if(x==-1)return(-1);return 0;}),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( SendMails ))

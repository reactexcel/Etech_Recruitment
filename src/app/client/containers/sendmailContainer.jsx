import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import {saveTemplate, fetchTemplate, deleteTemplate} from '../actions/emailTemplates'
import Header from './../components/generic/Header'
import SendEmail from './../components/sendmail'
import {fetchVariable} from '../actions/variable'
import {addLogs} from '../actions/logs'



class SendMails extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        if (!Meteor.userId()) {
          this.props.router.push('/login');
        }
        this.props.onFetchVariables()
    }

    render(){
        return(
        	<div>
                <SendEmail {...this.props} />
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        emailTemplates : state.entities.emailTemplates,
        inbox : state.entities.inbox,
        emailSetting : state.entities.emailSetting,
        variables:state.entities.variables,
        tags : state.entities.inboxTag.sort(function(a, b){let x=a.name.localeCompare(b.name); if(x==1)return(1);if(x==-1)return(-1);return 0;}),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onSaveTemplate:(id, template)=>{
            return dispatch(saveTemplate(id,template))
        },
        onfetchTemplate:()=>{
            return dispatch(fetchTemplate())
        },
        onDeleteTemplate:(id)=>{
            return dispatch(deleteTemplate(id))
        },
        onFetchVariables:()=>{
            return dispatch(fetchVariable())
        },
        logging: (action, id , detail) =>{
            return dispatch(addLogs(action, id , detail));
        }
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( SendMails ))

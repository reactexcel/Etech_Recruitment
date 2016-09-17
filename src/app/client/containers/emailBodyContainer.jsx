import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';

import EmailBodyHeader from '../components/emailbody/emailBodyHeader';
import EmailBody from '../components/emailbody/emailbody';
import { getEmailData, tagUpdateArchive, updateReject } from '../actions/emailDetails'
import { fetchAction, candidateAction } from '../actions/dynamicActions'
import * as candidateHistory_action from '../actions/candidateHistory'
import {onFetchTag, onAssignTag, onIgnoreMultipleCandidate, onRejectMultipleCandidate, sendMailToCandidate, removeTagFromCandidate} from '../actions/tags'
import {addLogs} from '../actions/logs'
import {fetchTemplate} from '../actions/emailTemplates'
import {fetchVariable} from '../actions/variable'
//import Header from '../components/generic/Header'
class EmailbodyContainer extends React.Component {
  constructor(props) {
    super(props);
    Tracker.autorun(function() {
      Meteor.ClientCall.setClientId(Meteor.userId());
    });
  }
  componentWillReceiveProps(props){
  }
  componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
    this.props.onEmailDetail(this.props.params.id);
    this.props.onLoadCandidateHistory(this.props.params.id)
    this.props.onFetchTamplets()
    this.props.onFetchActions()
    this.props.onFetchTag()
    this.props.onFetchVariables()
  }
  render() {
    return (
        <div>
          <EmailBody {...this.props}/>
        </div>
    );
  }
}

function mapStateToProps( state ){
    state = state.toJS()
    return {
        email : state.entities.email,
        inboxTag: state.entities.inboxTag,
        candidateHistory:state.entities.candidateHistory,
        emailTemplates : state.entities.emailTemplates,
        dynamicActions: state.entities.dynamicAction,
        variables:state.entities.variables
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
      onEmailDetail : (email_id) => {
        return dispatch(getEmailData( email_id ))
      },
      onIgnore : (id, tagId) => {
        //return dispatch(tagUpdateArchive( id,tagId))
        return dispatch(onIgnoreMultipleCandidate( id,tagId))
      },
      onReject : (id,tagId,reason) => {
        //return dispatch(updateReject(id,tagId,reason))
        return dispatch(onRejectMultipleCandidate(id,tagId,reason))
      },
      onAddAction: (actiontype, id, details)=>{
        return dispatch(addLogs(actiontype, id, details))
      },
      onLoadCandidateHistory : (email_id) => {
        return dispatch( candidateHistory_action.onLoadCandidateHistory(email_id) )
      },
      onFetchTamplets:()=>{
        return dispatch(fetchTemplate())
      },
      onFetchTag : () => {
        return dispatch(onFetchTag());
      },
      onSendMailToCandidate:(candidateIdList,name,sub,body,tagId)=>{
        return dispatch(sendMailToCandidate(candidateIdList,name,sub,body,tagId))
      },
      onFetchActions:()=>{
        return dispatch(fetchAction())
      },
      onCandidateAction : (A_id, email_ids, key,value) => {
        return dispatch(candidateAction(A_id, email_ids, key,value))
      },
      onRemoveTagFromCandidate : (emailId, tagId)=>{
        return dispatch(removeTagFromCandidate(emailId,tagId))
      },
      onFetchVariables:()=>{
            return dispatch(fetchVariable())
      }
    }
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailbodyContainer))

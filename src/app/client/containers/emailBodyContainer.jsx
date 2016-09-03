import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';

import EmailBodyHeader from '../components/emailbody/emailBodyHeader';
import EmailBody from '../components/emailbody/emailbody';
import { getEmailData, tagUpdateArchive, updateReject } from '../actions/emailDetails'
import * as candidateHistory_action from '../actions/candidateHistory'
import {onFetchTag, onAddTag, onAssignTag, onIgnoreMultipleCandidate, onRejectMultipleCandidate} from '../actions/tags'
import {addLogs} from '../actions/logs'
//import Header from '../components/generic/Header'
class EmailbodyContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(props){
  }
  componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
    this.props.onEmailDetail(this.props.params.id);
    this.props.onLoadCandidateHistory(this.props.params.id)
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
        candidateHistory:state.entities.candidateHistory
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
      }
    }
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailbodyContainer))

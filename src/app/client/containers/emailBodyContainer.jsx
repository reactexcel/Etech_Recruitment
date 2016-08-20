import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';

import EmailBodyHeader from '../components/emailbody/emailBodyHeader';
import EmailBody from '../components/emailbody/emailbody';
import { getEmailData, tagUpdateArchive, updateReject } from '../actions/emailDetails'
import {onFetchTag} from '../actions/tags'
import {addLogs} from '../actions/logs'
class EmailbodyContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(props){
  }
  componentWillMount(){
    this.props.onEmailDetail(this.props.params.id)
  }
  render() {
    return (
        <div>
          <EmailBodyHeader router={this.props.router}/>
          <EmailBody {...this.props}/>
        </div>
    );
  }
}

function mapStateToProps( state ){
    state = state.toJS()
    return {
        email : state.entities.email,
        inboxTag: state.entities.inboxTag
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
      onEmailDetail : (email_id) => {
        return dispatch(getEmailData( email_id ))
      },
      onIgnore : (id, tagId,status) => {
        return dispatch(tagUpdateArchive( id,tagId,status))
      },
      onReject : (id,tagId,reason) => {
        return dispatch(updateReject(id,tagId,reason))
      },
      onAddAction: (actiontype, id, details)=>{
        return dispatch(addLogs(actiontype, id, details))
      }
    }
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailbodyContainer))

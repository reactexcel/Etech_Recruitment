import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';

import EmailBodyHeader from '../components/emailbody/emailBodyHeader';
import EmailBody from '../components/emailbody/emailbody';
import { getEmailData, tagUpdateArchive, updateReject } from '../actions/emailDetails'
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
          <EmailBodyHeader />
          <EmailBody {...this.props}/>
        </div>
    );
  }
}

function mapStateToProps( state ){
    state = state.toJS()
    return {
        email : state.entities.email
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
      onEmailDetail : (email_id) => {
        return dispatch(getEmailData( email_id ))
      },
      onIgnore : (id, status) => {
        return dispatch(tagUpdateArchive( id,status ))
      },
      onReject : (id,reject,reason) => {
        return dispatch(updateReject(id,reject, reason))
      }
    }
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailbodyContainer))

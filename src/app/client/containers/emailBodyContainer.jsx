import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';

import EmailBodyHeader from '../components/emailbody/emailBodyHeader';
import EmailBody from '../components/emailbody/emailbody';
import { getEmailData } from '../actions/inbox'
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
      }
    }
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailbodyContainer))

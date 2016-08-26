import React, {PropTypes} from 'react';
import * as action from '../../../actions/emailSetting'
import {addLogs} from '../../../actions/logs'
import SendEmailSetting from '../../../components/emailSending'
import {withRouter} from 'react-router'
import { connect } from 'react-redux';

class EmailSendingContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
      if (!Meteor.userId()) {
        this.props.router.push('/login');
      }
  }    
  render() {
    return (
      <div>
        <SendEmailSetting {...this.props} />
      </div>);
  }
}

EmailSendingContainer.propTypes = {
  emailSetting: React.PropTypes.any.isRequired,
};


const mapStateToProps = (state) =>{
  state = state.toJS();
  return {
    emailSetting : state.entities.emailSetting
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onFetchSettings: () =>{
        dispatch(action.fetchSMTPSettings());
      },
      onSaveSettings: (detail) =>{
        dispatch(action.saveSendSettings(detail));
      },
      onTestDetails: (detail) =>{
        dispatch(action.onTestDetails(detail));
      },
      logging: (action, id , detail) =>{
        dispatch(addLogs(action, id , detail));
      },
    }
}

export default withRouter(connect(
 mapStateToProps,
 mapDispatchToProps
)(EmailSendingContainer));

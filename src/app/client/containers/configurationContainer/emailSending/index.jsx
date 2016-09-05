import React, {PropTypes} from 'react';
import * as action from '../../../actions/emailSetting'
import {testrow} from '../../../actions/emailSetting'
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
        return dispatch(action.fetchSMTPSettings());
      },
      onSaveSettings: (detail) =>{
        return dispatch(action.saveSendSettings(detail));
      },
      onTestDetails: (detail) =>{
        return dispatch(action.onTestDetailsSMTP(detail));
      },
      logging: (action, id , detail) =>{
        return dispatch(addLogs(action, id , detail));
      },
      onDeleteRow: (row_id) =>{
        return dispatch(action.deleteSMTPRow(row_id));
      }
}
}

export default withRouter(connect(
 mapStateToProps,
 mapDispatchToProps
)(EmailSendingContainer));

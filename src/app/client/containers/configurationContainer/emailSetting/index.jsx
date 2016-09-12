import React, {PropTypes} from 'react';
import * as action from '../../../actions/emailSetting'
import {addLogs} from '../../../actions/logs'
import EmailSettingFormContainer from '../../../components/emailSettingFormContainer'
import {withRouter} from 'react-router'
import { connect } from 'react-redux';

class EmailSettingContainer extends React.Component {
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
        <EmailSettingFormContainer {...this.props} />
      </div>);
  }
}

EmailSettingContainer.propTypes = {
  onFetchSettings: React.PropTypes.func.isRequired,
  onSaveSettings: React.PropTypes.func.isRequired,
  onTestDetails: React.PropTypes.func.isRequired,
  onRemoveDetails: React.PropTypes.func.isRequired,
  logging: React.PropTypes.func.isRequired,
  emailSetting: React.PropTypes.any.isRequired,
};


const mapStateToProps = (state) =>{
  state = state.toJS();
  return {
    emailSetting : state.entities.emailSetting,
    testDetails : state.entities.testDetails,
    uiLoading: state.ui.loading
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onFetchSettings: () =>{
        dispatch(action.onFetchSettingsFromDB());
      },
      onSaveSettings: (detail) =>{
        dispatch(action.onSaveSettingsToDB(detail));
      },
      onTestDetails: (detail) =>{
        return dispatch(action.onTestDetails(detail));
      },
      onStartCron: ( _id ) =>{
        return dispatch(action.onStartCron( _id ));
      },
      onRemoveDetails: (m_id) =>{
        dispatch(action.onRemoveDetails(m_id));
      },
      logging: (action, id , detail) =>{
        dispatch(addLogs(action, id , detail));
      },
      onActiveIMAPEmail: (row_id) =>{
        return dispatch(action.onActiveIMAPEmail(row_id));
      }
    }
}

export default withRouter(connect(
 mapStateToProps,
 mapDispatchToProps
)(EmailSettingContainer));

import React, {PropTypes} from 'react';
import * as action from '../../../actions/emailSetting'
import EmailSettingFormContainer from '../../../components/emailSettingFormContainer'
import {withRouter} from 'react-router'
import { connect } from 'react-redux';

class EmailSettingContainer extends React.Component {
  constructor(props) {
    super(props);
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
        dispatch(action.onFetchSettingsFromDB());
      },
      onSaveSettings: (detail) =>{
        dispatch(action.onSaveSettingsToDB(detail));
      }
    }
}

export default withRouter(connect(
 mapStateToProps,
 mapDispatchToProps
)(EmailSettingContainer));

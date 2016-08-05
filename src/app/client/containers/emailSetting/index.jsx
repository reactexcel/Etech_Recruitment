import React, {PropTypes} from 'react';
import * as action from '../../actions'
import EmailSettingFormContainer from '../../components/emailSettingFormContainer'
import {withRouter} from 'react-router'
import { connect } from 'react-redux';

class EmailSetting extends React.Component {
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

EmailSetting.propTypes = {
  onFetchSettings: PropTypes.func.isrequired,
  OnSaveSettings: PropTypes.func.isrequired,
  emailSetting: PropTypes.array.isrequired,
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
      OnSaveSettings: () =>{
        dispatch(action.onSaveSettingsToDB());
      }
    }
}

export default connect(
 mapStateToProps,
 mapDispatchToProps
)(EmailSetting);

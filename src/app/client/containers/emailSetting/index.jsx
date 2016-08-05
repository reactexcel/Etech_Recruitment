import React, {PropTypes} from 'react';
import EmailSettingFormContainer from '../../components/emailSettingFormContainer'

export default class EmailSetting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <EmailSettingFormContainer />
      </div>);
  }
}

EmailSetting.propTypes = {
};

import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class ConfigurationContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <h1>Congifguration panel</h1>
      <Link to='/config/emailSetting'> emailSetting </Link>
    </div>);
  }
}

ConfigurationContainer.propTypes = {
};

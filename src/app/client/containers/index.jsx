import React, {PropTypes} from 'react';
import EmailSetting from './emailSetting';

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="conmtainer">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <EmailSetting />
          </div>
        </div>
      </div>);
  }
}

AppContainer.propTypes = {
};

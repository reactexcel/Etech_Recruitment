export {default as RegisterContainer} from './registerContainer';
import React, {PropTypes} from 'react';
import { withRouter } from 'react-router';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{"padding": "0px 0px"}}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AppContainer);
export {default as RegisterContainer} from './registerContainer'

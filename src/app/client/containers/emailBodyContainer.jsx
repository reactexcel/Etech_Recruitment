import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';

import EmailBodyHeader from '../components/emailbody/emailBodyHeader';
import EmailBody from '../components/emailbody/emailbody';

class EmailbodyContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={"open": false}
  }
  componentWillReceiveProps(props){
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
        list : state.entities.inbox.emails
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}


export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailbodyContainer))

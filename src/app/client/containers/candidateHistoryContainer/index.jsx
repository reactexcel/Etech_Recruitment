import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';
import CandidateHistoryHeader from '../../components/candidateHistory/candidateHistoryHeader';
import CandidateHistory from '../../components/candidateHistory/candidateHistory';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class candidateHistoryContainer extends React.Component{
  constructor(props) {
    super(props);
    console.log(props);
  }
  componentWillMount( ){
    if (!Meteor.userId()) {
        this.props.router.push('/login');
      }
  }
  getChildContext() {
         return {
            muiTheme: getMuiTheme(baseTheme)
         };
  }
  render() {
    return (
        <div>
          <CandidateHistoryHeader />
          <CandidateHistory {...this.props}/>
        </div>
    );
  }
}
candidateHistoryContainer.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};
export default candidateHistoryContainer
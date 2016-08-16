import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import {withRouter, Link} from 'react-router';
import CandidateHistoryHeader from '../../components/candidateHistory/candidateHistoryHeader';
import CandidateHistory from '../../components/candidateHistory/candidateHistory';
//import * as history_action from '../../actions/candidateHistory';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

class candidateHistoryContainer extends React.Component{
  constructor(props) {
    super(props);
    console.log(props);
  }
  componentWillReceiveProps(props){
  }
  componentWillMount( ){
    //this.props.onHistoryDate()
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
/*function mapStateToProps( state ){
    state = state.toJS()
    return {
      history:state.entities.history
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
      onHistoryDate : () => {
            return dispatch( history_action.getHistoryData() )
        }
      }
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(candidateHistoryContainer))*/
export default candidateHistoryContainer
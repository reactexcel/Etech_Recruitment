import React, {PropTypes} from 'react';
import {Router, browserHistory, Link,withRouter} from 'react-router'
import { connect } from 'react-redux';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LogTable from '../../../components/logTable';
import * as _ from 'lodash';
import * as log_action from '../../../actions/logs'

class LogsContainer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
            log_per_page : 5,
            page_num : 1
        }
        this.pageChange = this.pageChange.bind(this)
    }
    componentWillMount(){
      if (!Meteor.userId()) {
        this.props.router.push('/login');
      }
        this.props.onLogData()
    }
    componentWillReceiveProps( props ){
    }
    pageChange( page_num,log_per_page_afterFirstPage ){
        if( page_num != '' ){
            if(page_num==1){
            this.props.onLogData( this.state.log_per_page, page_num )
          }else{
            this.props.onLogData( log_per_page_afterFirstPage, page_num )
          }
        }
    }
    render() {
    return (
      <div>
        <LogTable prestent_per_page={this.state.log_per_page} log={this.props.log} pageChange={this.pageChange}/>
      </div>
      );
    }
}
LogsContainer.propTypes = {
  onLogData: React.PropTypes.func.isRequired,
  log:React.PropTypes.any.isRequired,
};
function mapStateToProps(state,props){
  state = state.toJS()

  return {
    log:state.entities.logs
  }
}
const mapDispatchToProps=(dispatch)=>{
  return{
    onLogData : () => {
            return dispatch( log_action.getLogData() )
        }
  }
}
export default withRouter(connect(
mapStateToProps,
mapDispatchToProps
)(LogsContainer))

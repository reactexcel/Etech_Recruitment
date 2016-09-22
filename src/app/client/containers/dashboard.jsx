import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'
import * as actions from '../actions/tags'
import Header from './../components/generic/Header'
import Dashboard from './../components/dashboard'
import * as dashboardActions from '../actions/dashboard'



class DashboardContainer extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        if (!Meteor.userId()) {
        this.props.router.push('/login');
        }
        //this.props.onFetchTag()
        this.props.onFetchTagForDashboard()       
    }   

    render(){
        return(
        	<div>
                <Header {...this.props} position={0} altr={"Dashboard"}/>
                <Dashboard {...this.props}/>
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        //tags : state.entities.inboxTag,
        dashboardData: state.entities.dashboard
       }
}
const mapDispatchToProps = (dispatch) => {
    return {
      /*onFetchTag: () =>{
        dispatch(actions.onFetchTag());
      },*/
      onFetchTagForDashboard: () =>{
        dispatch(dashboardActions.onFetchTagForDashboard());
      }
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( DashboardContainer ))

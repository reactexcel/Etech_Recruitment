import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'
import * as actions from '../actions/tags'
import * as actions_emailSetting from './../actions/emailSetting'
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
        this.props.onFetchTagForDashboard();
        this.props.onFetchSettings();
    }

    render(){
      let setting_status = false;
      if( typeof this.props.emailSetting != 'undefined' && this.props.emailSetting.length > 0 ){
          _.map( this.props.emailSetting, ( setting ) => {
              if(typeof setting.smtp !== "undefined"){
                if(setting.smtp.status == 1){
                  setting_status = true;
                }
              }else{
                if( setting.active == true && setting.status == 1){
                  setting_status = true;
                }
              }
          });
      }
        return(
        	<div>
                <Header {...this.props} position={0} altr={"Dashboard"}/>
                {setting_status ? "" : <div className="alert alert-danger text-center" style={{width:"99%",zIndex:'9999',margin:'5px'}}><b>IMAP/SMTP</b> settings are not working, System is not usable without that<b> !!!!</b></div>}
                <Dashboard {...this.props}/>
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        //tags : state.entities.inboxTag,
        emailSetting : state.entities.emailSetting,
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
      },
      onFetchSettings: () =>{
        dispatch(actions_emailSetting.onFetchSettingsFromDB());
      },
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( DashboardContainer ))

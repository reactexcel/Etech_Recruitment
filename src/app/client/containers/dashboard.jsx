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
        this.state = {
          is_imap:1,
          is_smtp:1
        }
    }
    componentWillMount(){
        if (!Meteor.userId()) {
        this.props.router.push('/login');
        }
        //this.props.onFetchTag()
        this.props.onFetchTagForDashboard();
        this.props.onFetchSettings();
        this.props.onCheckSmtpImap();
    }
    componentWillReceiveProps(props){
      if(props.checkSmtpImap.length > 0){
        this.setState({
          is_imap:props.checkSmtpImap[0].imap_active,
          is_smtp:props.checkSmtpImap[0].smtp_active
        })
      }
    }

    render(){
      let errorMessage = "";
      if(this.state.is_imap == 0 && this.state.is_smtp == 0){
        errorMessage = "Imap and Smtp settings are not working, System is not usable without that"
      }else if(this.state.is_imap == 0 && this.state.is_smtp != 0){
        errorMessage = "Imap settings is not working, System is not usable without that"
      }else if(this.state.is_imap != 0 && this.state.is_smtp == 0){
        errorMessage = "Smtp settings is not working, System is not usable without that"
      }
        return(
        	<div>
                <Header {...this.props} position={0} altr={"Dashboard"}/>
                {errorMessage == "" ? "" : <div className="alert alert-danger text-center" style={{width:"99%",position:'relative',top:'12px',left:'0.4%'}}><b>{errorMessage}</b></div>}
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
        checkSmtpImap: state.entities.checkSmtpImap,
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
      onCheckSmtpImap: () =>{
        dispatch(actions_emailSetting.onCheckSmtpImap());
      }
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( DashboardContainer ))

import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import * as actions_inbox from './../actions/inbox'
import * as actions_emailSetting from './../actions/emailSetting'
import Header from './../components/generic/Header'
import EmailsList from './../components/inbox/EmailsList'
import {addLogs} from '../actions/logs'
import { onFetchTag, onAddTag, onAssignTag, onScheduleMultipleCandidate, onIgnoreMultipleCandidate, onRejectMultipleCandidate,sendMailToCandidate} from '../actions/tags'
import {fetchTemplate} from '../actions/emailTemplates'
import {fetchVariable} from '../actions/variable'

class Inbox extends React.Component {
    constructor( props ){
        super( props )
        this.state = {
            emails_per_page : 20,
            page_num : 1,
            imap_emails : [],
            emails_fetch_status : 0,
            is_imap:1,
            is_smtp:1,
            current_sec:'',
        }
        this.doPageChange = this.doPageChange.bind(this)
        this.update = true;
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        let currentSection = localStorage.getItem('currentSection');
        if(currentSection == null || currentSection == ""){
        this.props.onInboxData( this.state.emails_per_page, this.state.page_num ,'')
        this.props.onFetchSettings()
        this.props.onFetchTag()
        this.props.onFetchTamplets()
        this.props.onFetchVariables()
        this.props.onCheckSmtpImap();
        }else{
            //this.props.onInboxData( this.state.emails_per_page, 1 ,'')
            this.props.onUpdateUnreadStatus()
            this.props.onCheckSmtpImap();
        }
        this.setState({
            current_sec:currentSection
        })
        localStorage.setItem( 'currentSection', '' );

    }
    componentWillReceiveProps( props ){
        if(props.checkSmtpImap.length > 0){
            this.setState({
                is_imap:props.checkSmtpImap[0].imap_active,
                is_smtp:props.checkSmtpImap[0].smtp_active
            })
        }
        if( props.inbox.emails_fetch_status.length > 0 ){
            //this will run after fetching new emails
            let imap_email_with_fetch_response = _.map( props.emailSetting,( email )=>{
                let check_id = email._id
                let checkFetchStatus = _.find( props.inbox.emails_fetch_status, {'imap_email_monogid': check_id } )
                if( typeof checkFetchStatus == 'undefined' ){
                    email.fetch_email_status = {}
                }else{
                    email.fetch_email_status = checkFetchStatus
                }
                return email
            })
            if( this.state.imap_emails.length == 0 ){
                let tag;
                if(typeof props.params.nav == 'undefined'){
                    tag = ''
                }else{
                    tag=this.props.inbox.tag
                }
                this.props.onInboxData( this.state.emails_per_page, this.state.page_num, tag )
            }
            this.setState({
                'emails_fetch_status' : 1,
                'imap_emails' : imap_email_with_fetch_response
            })

        }else{
            if( typeof props.emailSetting != 'undefined' && props.emailSetting.length > 0 ){
                let raw_imap_email = props.emailSetting
                let imap_emails = _.map( raw_imap_email, ( email ) => {
                    email.status_fetch = "pending"
                    return email
                })
                this.setState({
                    'imap_emails' : imap_emails
                })
            }
        }
        //window.location.replace("http://localhost:3000/#/inbox?_k=n069dj");
    }
    /*
    componentDidUpdate(){
        if( this.state.imap_emails.length > 0 &&   this.state.emails_fetch_status == 0 ){
            let imap_emails_ids = _.map( this.state.imap_emails, ( email ) => {
                return email._id
            })
            if(this.update){
              this.update = false;
              //this.props.onFetchNewEmails( imap_emails_ids )
            }
        }
    }
    */
    doPageChange( page_num ){
        if( page_num != '' ){
            this.props.onInboxData( this.state.emails_per_page, page_num, this.props.inbox.tag )
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
      let setting_status = true, i = false;
      if( typeof this.props.emailSetting != 'undefined' && this.props.emailSetting.length > 0 ){
          _.map( this.props.emailSetting, ( setting ) => {
              if(typeof setting.smtp !== "undefined"){
                if(setting.smtp.status == 1){
                  i = true;
                }
              }else{
                if( setting.active == true && setting.status == 1){
                  i = true;
                }
              }
          });
          if(i){
            setting_status = i;
          }
      }
        return(
        	<div className='show'>
                <Header {...this.props} position={1}/>
                <EmailsList  doPageChange={this.doPageChange} imap_emails={this.state.imap_emails}
                 emails_per_page={this.state.emails_per_page} page_num={this.state.page_num}
                 route={this.props.router}
                 errorMessage = {errorMessage}
                 current_sec = {this.state.current_sec}
                 {...this.props}
                />
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        inbox : state.entities.inbox,
        emailSetting : state.entities.emailSetting,
        tags : state.entities.inboxTag.sort(function(a, b){let x=a.name.localeCompare(b.name); if(x==1)return(1);if(x==-1)return(-1);return 0;}),
        emailTemplates : state.entities.emailTemplates,
        variables:state.entities.variables,
        uiLoading: state.ui.loading,
        checkSmtpImap: state.entities.checkSmtpImap,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
     	  onInboxData : ( emails_per_page, page_num, tag ) => {
            return dispatch( actions_inbox.getInboxData( emails_per_page, page_num, tag ) )
        },
        onUpdateUnreadStatus:()=>{
            return dispatch(actions_inbox.UpdateUnreadStatus())
        },
        onFetchSettings : () => {
            return dispatch( actions_emailSetting.onFetchSettingsFromDB());
        },
        onFetchNewEmails : ( imapEmails ) => {
            return dispatch( actions_inbox.fetchNewEmails( imapEmails ) )
        },
        onFetchTag : () => {
            return dispatch(onFetchTag());
        },
        onAssignTag : (m_id, t_id) => {
            return dispatch(onAssignTag(m_id, t_id));
        },
        onIgnoreMultipleCandidate : (idList, tagId) => {
            return dispatch(onIgnoreMultipleCandidate( idList,tagId))
        },
        onRejectMultipleCandidate : (idList,tagId,reason) => {
            return dispatch(onRejectMultipleCandidate(idList,tagId,reason))
        },
        onFetchTamplets:()=>{
            return dispatch(fetchTemplate())
        },
        onSchedule: (id, tagId) =>{
            return dispatch(onScheduleMultipleCandidate( id,tagId))
        },
        onRead : ( _id ) => {
            return dispatch( actions_inbox.getInboxData( _id ) )
        },
        onDeleteMultipleEmails : (idList) => {
          return dispatch(actions_inbox.deleteInboxMails(idList))
        },
        onFetchVariables:()=>{
            return dispatch(fetchVariable())
        },
        onCheckSmtpImap: () =>{
        dispatch(actions_emailSetting.onCheckSmtpImap());
      }
    }
}

const VisibleInbox = connect(
  mapStateToProps,
  mapDispatchToProps
)( Inbox )

const RouterVisibleInbox = withRouter( VisibleInbox )

export default RouterVisibleInbox

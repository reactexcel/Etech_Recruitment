import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'

import * as actions_inbox from './../actions/inbox'
import * as actions_emailSetting from './../actions/emailSetting'
import Header from './../components/generic/Header'
import EmailsList from './../components/inbox/EmailsList'
import {addLogs} from '../actions/logs'
import { onFetchTag, onAddTag, onAssignTag, onIgnoreMultipleCandidate, onRejectMultipleCandidate} from '../actions/tags'

class Inbox extends React.Component {
    constructor( props ){
        super( props )
        this.state = {
            emails_per_page : 20,
            page_num : 1,
            imap_emails : [],
            emails_fetch_status : 0
        }
        this.doPageChange = this.doPageChange.bind(this)
    }
    componentWillMount(){
        this.props.onInboxData( this.state.emails_per_page, this.state.page_num ,"")
        this.props.onFetchSettings()
        this.props.onFetchTag()
    }
    componentWillReceiveProps( props ){
        if( props.inbox.emails_fetch_status.length > 0 ){
            //this will run after fetching new emails
            let imap_email_with_fetch_response = _.map( props.emailSetting,( email )=>{
                let check_id = email._id._str
                let checkFetchStatus = _.find( props.inbox.emails_fetch_status, {'imap_email_monogid': check_id } )
                if( typeof checkFetchStatus == 'undefined' ){
                    email.fetch_email_status = {}
                }else{
                    email.fetch_email_status = checkFetchStatus
                }
                return email
            })
            if( this.state.imap_emails.length == 0 ){
                this.props.onInboxData( this.state.emails_per_page, this.state.page_num )
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

    }
    componentDidUpdate(){
        if( this.state.imap_emails.length > 0 &&   this.state.emails_fetch_status == 0 ){
            let imap_emails_ids = _.map( this.state.imap_emails, ( email ) => {
                return email._id
            })
            this.props.onFetchNewEmails( imap_emails_ids )
        }
    }
    doPageChange( page_num ){
        if( page_num != '' ){
            this.props.onInboxData( this.state.emails_per_page, page_num )
        }
    }
    render(){
        return(
        	<div>
                <Header {...this.props} position={1}/>
                <EmailsList inbox={this.props.inbox} doPageChange={this.doPageChange} imap_emails={this.state.imap_emails} tags={this.props.tags} onAssignTag={this.props.onAssignTag}
                  onInboxData={this.props.onInboxData} emails_per_page={this.state.emails_per_page} page_num={this.state.page_num} inboxTag={this.props.inboxTag} onIgnoreMultipleCandidate={this.props.onIgnoreMultipleCandidate}
                  onRejectMultipleCandidate={this.props.onRejectMultipleCandidate} route={this.props.router}
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
        inboxTag:state.entities.inboxTag
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
     	onInboxData : ( emails_per_page, page_num, tag ) => {
            return dispatch( actions_inbox.getInboxData( emails_per_page, page_num, tag ) )
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
        }
    }
}

const VisibleInbox = connect(
  mapStateToProps,
  mapDispatchToProps
)( Inbox )

const RouterVisibleInbox = withRouter( VisibleInbox )

export default RouterVisibleInbox

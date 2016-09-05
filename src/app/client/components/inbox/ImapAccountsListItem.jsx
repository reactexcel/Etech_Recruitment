import React from 'react'

import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'

import FontIcon from 'material-ui/FontIcon';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LinearProgress from 'material-ui/LinearProgress';
import MenuItem from 'material-ui/MenuItem';

class ImapAccountsListItem extends React.Component {

    constructor( props ){
        super( props );
        this.count = 0;
    }
    render () {
      return(
    <div  key={ this.props.imapEmail._id} >
      <MenuItem
        disabled={!this.props.imapEmail.active}
        children={
          <div >
            <b style={{textDecoration: this.props.inbox.tag == this.props.imapEmail._id? 'underline':''}}>
              {this.props.imapEmail.emailId}
            </b>
            {this.props.imapEmail.active?
              <p style={{"fontSize": "11px",  lineHeight: "110%"}}>
                <i className="fa fa-circle" aria-hidden="true" style={{color: 'green'}}></i> Active <br/>
              </p>:
              <p style={{"fontSize": "11px",  lineHeight: "110%"}}>
              <i className="fa fa-circle" aria-hidden="true" style={{color: '#bb1133'}}></i> Disabled
              </p>
            }
            <Divider />
          </div>
        }
        onTouchTap={() => {this.props.onInboxData( this.props.emails_per_page, this.props.page_num , this.props.imapEmail._id);}}
        />
    </div>
      );
    }

}

export default ImapAccountsListItem




/*
render(){
  let fetch_response_TYPE = <LinearProgress mode="indeterminate" color="green" />
  let fetch_response_EMAILS_FETCHED_COUNT = ""
  let fetch_response_MESSAGE = ""
  if( typeof this.props.imapEmail.fetch_email_status != 'undefined'){
  if( typeof this.props.imapEmail.fetch_email_status.email_fetch_response != 'undefined' ){
    if( typeof this.props.imapEmail.fetch_email_status.email_fetch_response.type != 'undefined' ){
      fetch_response_TYPE = this.props.imapEmail.fetch_email_status.email_fetch_response.type
    }
    if( typeof this.props.imapEmail.fetch_email_status.email_fetch_response.message != 'undefined' ){
      fetch_response_MESSAGE = this.props.imapEmail.fetch_email_status.email_fetch_response.message
    }
    if( typeof this.props.imapEmail.fetch_email_status.email_fetch_response.emails_fetched != 'undefined' ){
      fetch_response_EMAILS_FETCHED_COUNT = this.props.imapEmail.fetch_email_status.email_fetch_response.emails_fetched
      if( fetch_response_TYPE == "SUCCESS" ){
        if(fetch_response_EMAILS_FETCHED_COUNT >= 20){
          console.log("again calling method", this.props.imapEmail);
          this.count += fetch_response_EMAILS_FETCHED_COUNT;
          this.props.onFetchNewEmails( [this.props.imapEmail._id] );
          fetch_response_TYPE = <LinearProgress mode="indeterminate" color="green" />
          fetch_response_EMAILS_FETCHED_COUNT = this.count + '+ Emails Found ...'
        }else if( this.count > 0 ){
          fetch_response_EMAILS_FETCHED_COUNT = this.count + ' New Email(s)'
        }else{
          fetch_response_EMAILS_FETCHED_COUNT = fetch_response_EMAILS_FETCHED_COUNT + ' New Email(s)'
        }
      }else if( fetch_response_TYPE == "RESPONSE_ERROR" ){
        if( typeof this.props.imapEmail.fetch_email_status.email_fetch_response.type != 'undefined' )
          if(this.props.imapEmail.fetch_email_status.email_fetch_response.emails_fetched == 0){
              fetch_response_TYPE = ''
              fetch_response_EMAILS_FETCHED_COUNT = 'No More Mails(s)'
          }else
                fetch_response_EMAILS_FETCHED_COUNT = fetch_response_MESSAGE
      }
    }
    }
  }
let imap_emailid = this.props.imapEmail.emailId || ""
  let f_char = imap_emailid.charAt(0)
    f_char = f_char.toUpperCase();
    return(
  <div  key={ this.props.imapEmail._id}>
    <ListItem
      primaryText= {
        <div>
          <b>
            {this.props.imapEmail.emailId}
          </b>
        </div>
      }
      secondaryText={
        <div style={{"fontSize": "11px"}}>
            {fetch_response_TYPE}
            <br/>
            {fetch_response_EMAILS_FETCHED_COUNT}
        </div>
      }
      secondaryTextLines={2}
      />
    <Divider />
  </div>
    );
}
*/
import React from 'react'

import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'

import FontIcon from 'material-ui/FontIcon';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';

class ImapAccountsListItem extends React.Component {

    constructor( props ){
        super( props );
    }
    render(){

    	//console.log( this.props.imapEmail.fetch_email_status.email_fetch_response )

    	let fetch_response_TYPE = "Pending"
    	let fetch_response_EMAILS_FETCHED_COUNT = ""
    	let fetch_response_MESSAGE = ""

    	if( typeof this.props.imapEmail.fetch_email_status != 'undefined'){

    		console.log( this.props.imapEmail.fetch_email_status  )

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
						fetch_response_EMAILS_FETCHED_COUNT = fetch_response_EMAILS_FETCHED_COUNT + ' New Emails'
					}else if( fetch_response_TYPE == "RESPONSE_ERROR" ){
						fetch_response_EMAILS_FETCHED_COUNT = fetch_response_MESSAGE
					}
				}
    		}
    	}
		
		let imap_emailid = this.props.imapEmail.emailId
    	let f_char = imap_emailid.charAt(0)
      	f_char = f_char.toUpperCase();
      
      	return(
			<div  key={ this.props.imapEmail._id}>
				<ListItem 
					primaryText= {
						<p>
                    		<b>
                      			{this.props.imapEmail.emailId}
                    		</b>
                  		</p>
					}
            		rightIcon={<ActionInfo />}
            		secondaryText={
	                  <p style={{"fontSize": "11px"}}>
	                    {fetch_response_TYPE}
	                    <br/>
	                    {fetch_response_EMAILS_FETCHED_COUNT}
	                  </p>
	                }
	                secondaryTextLines={2}

            	/>
            	<Divider />
          	</div>
      	);
    }
}

export default ImapAccountsListItem
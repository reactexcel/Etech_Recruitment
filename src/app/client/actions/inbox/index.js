import { createAction } from 'redux-actions'
import * as _ from 'lodash'

export const ACTION_SUCCESS_INBOX = "ACTION_SUCCESS_INBOX"
export const ACTION_EMPTY_INBOX = "ACTION_EMPTY_INBOX"
export const ACTION_ERROR_INBOX = "ACTION_ERROR_INBOX"

export function success_inbox( data ){
	return createAction( ACTION_SUCCESS_INBOX )( data )
}
export function empty_inbox( data ){
	return createAction( ACTION_EMPTY_INBOX )( data )
}
export function error_inbox( data ){
	return createAction( ACTION_ERROR_INBOX )( data )
}
export function onRead( _id ){
	return createAction( "ON_READ_EMAIL" )( _id )
}

const loading = (bool) => {
  return createAction('LOADING')(bool);
}

export function getInboxData( emails_per_page, page_num, tag ){
	return ( dispatch, getState ) => {
		return new Promise( ( resolve, reject ) => {
			dispatch(loading(true));
			Meteor.call('getEmailsForInbox', emails_per_page, page_num, tag, (err, data) => {
				if(err){
					dispatch ( error_inbox( err ) )
					dispatch(loading(false));
				}else{
					if( data.emails.length == 0 && tag == ''){
						dispatch ( empty_inbox( 'No more emails' ) )
					}else{
						dispatch ( success_inbox( data  ) )
					}
					dispatch(loading(false));
				}
			})

		})
	}
}
//---------------------------------------------------------------------------

export const ACTION_SUCCESS_EMAILS_FETCH_STATUS = "ACTION_SUCCESS_EMAILS_FETCH_STATUS"

export function success_emails_fetch_status( data ){
	return createAction( ACTION_SUCCESS_EMAILS_FETCH_STATUS )( data )
}


// export function update_emails_store(  ){
// 	return ( dispatch, getState ) => {
// 		return new Promise( ( resolve, reject ) => {
// 			Meteor.call('doUpdateEmailsStore', (err, data) => {
// 				if(err){
// 					dispatch ( error_new_emails( err ) )
// 				}else{
// 					if( data == 'INVALID_LOGIN'){
// 						dispatch ( error_new_emails( "You are not logged in!!" ) )
// 					}else if( data == 'SETTINGS_NOT_FOUND'){
// 						dispatch ( error_new_emails( "Imap settings not found" ) )
// 					}else if( data == 0 ){
// 						dispatch ( empty_new_emails( 'No new emails found' ) )
// 					}else{
// 						let msg = data + ' new emails found'
// 						dispatch ( success_new_emails( msg ) )
// 						if( data == 100 ){
// 							//if response hase 100 emails then call again to fetch more as api has limit of 100 emails
// 							dispatch ( update_emails_store(  ) )
// 						}
// 					}
// 				}
// 			})
// 		})
// 	}
// }

function update_emails_store( imapEmails, responseToReturn, callback ){

	if( imapEmails.length > 0 ){
		let toProcessId = imapEmails[0]
		imapEmails.shift() // remove first element since it will process now
		Meteor.call('doUpdateEmailsStore',toProcessId, ( err, data )=>{
			let imap_email_monogid = toProcessId
			let email_fetch_response = ""
			if( err ){
				email_fetch_response = err
			}else{
				email_fetch_response = data
			}

			responseToReturn.push({
				"imap_email_monogid" : imap_email_monogid,
				"email_fetch_response" : email_fetch_response,
			})
			update_emails_store( imapEmails, responseToReturn, callback )
		})

	}else{
		callback( responseToReturn )
	}



}

export function fetchNewEmails( imapEmails ){

	return ( dispatch, getState ) => {

		if( imapEmails.length > 0 ){
			update_emails_store( imapEmails,[], function( allEmailsFetchStatus ){
				dispatch ( success_emails_fetch_status( allEmailsFetchStatus  ) )
			})
		}else{
			//console.log( 'all are done')
		}
	}
}

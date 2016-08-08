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

export function getInboxData( emails_per_page, page_num ){
	return ( dispatch, getState ) => {
		return new Promise( ( resolve, reject ) => {

			Meteor.call('getEmailsForInbox', emails_per_page, page_num, (err, data) => {
				if(err){
					dispatch ( error_inbox( err ) )
				}else{
					if( data.emails.length == 0 ){
						dispatch ( empty_inbox( 'No more emails' ) )
					}else{

						console.log( data )

						dispatch ( success_inbox( data  ) ) 
					}
				}
			})

		})
	}
}



import { createAction } from 'redux-actions'
import * as _ from 'lodash'

export const ACTION_SUCCESS_NEW_EMAILS = "ACTION_SUCCESS_NEW_EMAILS"
export const ACTION_EMPTY_NEW_EMAILS = "ACTION_EMPTY_NEW_EMAILS"
export const ACTION_ERROR_NEW_EMAILS = "ACTION_ERROR_NEW_EMAILS"

export function success_new_emails( data ){
	return createAction( ACTION_SUCCESS_NEW_EMAILS )( data )
}
export function empty_new_emails( data ){
	return createAction( ACTION_EMPTY_NEW_EMAILS )( data )
}
export function error_new_emails( data ){
	return createAction( ACTION_ERROR_NEW_EMAILS )( data )
}

export function update_emails_store(  ){
	return ( dispatch, getState ) => {
		return new Promise( ( resolve, reject ) => {
			Meteor.call('doUpdateEmailsStore', (err, data) => {
				if(err){
					dispatch ( error_new_emails( err ) )
				}else{
					if( data == 0 ){
						dispatch ( empty_new_emails( 'No new emails found' ) )
					}else{
						let msg = data + ' new emails found'
						dispatch ( success_new_emails( msg ) )
					}
				}
			})
		})
	}
}



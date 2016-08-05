import { createAction } from 'redux-actions'
import * as _ from 'lodash'
import { Accounts } from 'meteor/accounts-base'

export const ACTION_SUCCESS_FORGOT_PASSOWORD = "ACTION_SUCCESS_FORGOT_PASSOWORD"
export const ACTION_ERROR_FORGOT_PASSOWORD = "ACTION_ERROR_FORGOT_PASSOWORD"

export function success_forgot_password( data ){
	return createAction( ACTION_SUCCESS_FORGOT_PASSOWORD )( data )
}

export function error_forgot_password( data ){
	return createAction( ACTION_ERROR_FORGOT_PASSOWORD )( data )
}

export function forgot_password( emailid ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('doUpdateUserPassword', emailid, 'DEMOPASSWORD', (err, data) => {
				if(err){
					error_forgot_password( 'error occurs' )
				}else{
					if( data.error == 0 ){
					 	dispatch ( success_forgot_password('Check your email for new password') )
					}else{
						dispatch ( success_forgot_password(data.message) )
					}
				}
			})
		})
	}
}



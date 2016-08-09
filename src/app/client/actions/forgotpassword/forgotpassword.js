import { createAction } from 'redux-actions'
import * as _ from 'lodash'
import { Accounts } from 'meteor/accounts-base'
import {config_ENV} from '../../../config/index.jsx'

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
			Meteor.call('doUpdateUserPassword', emailid, (err, data) => {
				if(err){
					reject(err)
					error_forgot_password( 'error occurs' )
				}else{
					if( data.error == 0 ){
						 	let email={
              					to:emailid, 
        				     	from:config_ENV.email._id, 
              					subject:'Password reset',
              					message:'Your New password is - <b>'+ data.pass + '</b> for email - '+ emailid
            				}
            				Meteor.call('sendMail',email)
						dispatch ( success_forgot_password('Check your email for new password') )
						resolve(0)
					}else{
						dispatch ( success_forgot_password(data.message) )
						resolve(data.message)
					}
				}
			})
		})
	}
}



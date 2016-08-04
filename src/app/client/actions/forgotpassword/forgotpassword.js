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
			//Accounts.createUser( {email: 'arun', password : 'kumar'}, ( error ) => {
			Accounts.setPassword( 'SZpuBr8TZXNGJMqXy','arunkumar', ( error ) => {
			//Accounts.findUserByEmail(emailid, ( error ) => {
				if( error ){
					console.log('error')
					console.log( error )
				}else{
					console.log('success')
				}

			})
			// Meteor.call('addTodo',text, (err,todo) => {
			// 	if(err){
					
			// 	}else{
			// 		dispatch(add_to_do(text));
			// 		dispatch( loadTodoList() )
			// 	}
			// });
		})
	}
}



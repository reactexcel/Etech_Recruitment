import {createAction} from 'redux-actions';
import * as _ from 'lodash'

export const ADD_LOG = "ADD_LOG";
export const ACTION_FOUND_LOG = "ACTION_FOUND_LOG"
export const ACTION_EMPTY_LOG = "ACTION_EMPTY_LOG"
export const ACTION_ERROR_LOG = "ACTION_ERROR_LOG"

export function addLogs(action_type,user_id,details){
	return function (dispatch,getState){
		return new Promise( (resolve,reject) => {
			Meteor.call('log.insert', action_type,user_id,details, (error, logDisplay) => {
				if(error){
					reject(error)
				}else{
					dispatch(action_after_add_log(logDisplay))
					resolve(logDisplay)
				}
			})
		}) 
	} 
}
export function action_after_add_log(logDisplay){
	return createAction(ADD_LOG)(logDisplay)
}
export function log_found( data ){
	return createAction( ACTION_FOUND_LOG )( data )
}
export function empty_log( data ){
	return createAction( ACTION_EMPTY_LOG )( data )
}
export function log_error( data ){
	return createAction( ACTION_ERROR_LOG )( data )
}

export function getLogData(){
	return ( dispatch, getState ) => {
		return new Promise( ( resolve, reject ) => {

			Meteor.call('getlogsToDisplay', (err, data) => {
				if(err){
					dispatch ( log_error( err ) )
				}else{
					if( data.logs.length == 0 ){
						dispatch ( empty_log( 'No more logs' ) )
					}else{
						console.log(data,"in action")
						dispatch ( log_found( data  ) ) 
					}
				}
			})

		})
	}
}
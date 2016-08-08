import {createAction} from 'redux-actions';
export const ADD_LOG = "ADD_LOG";

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
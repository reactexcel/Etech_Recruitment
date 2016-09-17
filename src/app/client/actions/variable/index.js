import { createAction } from 'redux-actions'
import * as _ from 'lodash'

//export const ACTION_SUCCESS_FETCH_VARIABLE = "ACTION_SUCCESS_FETCH_VARIABLE"
export const ACTION_SUCCESS_FETCH_VARIABLE = "ACTION_SUCCESS_FETCH_VARIABLE"
//export const ACTION_UPDATE_PROGRESS_STATUS = "ACTION_UPDATE_PROGRESS_STATUS"
//export const UPDATE_TAGID = "UPDATE_TAGID"


export function saveVariable(id,variable){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('saveVariable', id,variable , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchVariable(data) )
					resolve(data)
				}
			})
		})
	}
}

export function fetchVariable(){
	return (dispatch,getState)=>{
		return new Promise((resolve,reject)=>{
			Meteor.call('fetchAllVariable',(err,data)=>{
				if(err){
					reject(err)
				}else{
					if(data.length > 0){
						dispatch(success_fetch_variable(data))
						resolve('variable loading completed')
					}else{
						dispatch(success_fetch_variable(data))
						resolve('No variable in database')
					}
				}
			})
		})
	}
}

export function deleteVariable( id ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('deleteVariable', id , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchVariable(data) )
					resolve(data)
				}
			})
		})
	}
}


export function success_fetch_variable( data ){
	return createAction( ACTION_SUCCESS_FETCH_VARIABLE )( data )
}
/*export function deleteAction( id ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('deleteAction', id , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchAction(data) )
					resolve(data)
				}
			})
		})
	}
}

export function candidateAction(A_id, email_ids){
	return (dispatch,getState) => {
		return new Promise( (resolve, reject) => {
			Meteor.call('candidateActionTaken', A_id, email_ids, (err, data) =>{
				if(err){
					reject(err)
				}else{
					if(data.successMail.length > 0){
						dispatch(updateTagId(data.tag._id,data.emailIdS))
						dispatch ( onAssignTag(data.successMail, data.tag._id) )
						dispatch(updateProgressStatus(data.prograsStatus))
						resolve('Action performed')
					}else{
						resolve('Failed to perform action')
					}
				}
			})
		})
	}
}
export const updateProgressStatus = (data)=>{
	return createAction(ACTION_UPDATE_PROGRESS_STATUS)(data)
}
export const updateTagId = (tagId,emailIds)=>{
	return createAction(UPDATE_TAGID)(tagId,emailIds)
}*/


import { createAction } from 'redux-actions'
import * as _ from 'lodash'

export const FETCH_TAG_FOR_DASH = "FETCH_TAG_FOR_DASH"
/*export const ACTION_UPDATE_PROGRESS_STATUS = "ACTION_UPDATE_PROGRESS_STATUS"
export const UPDATE_TAGID = "UPDATE_TAGID"*/

export function onFetchTagForDashboard(){
	return (dispatch,getState)=>{
		return new Promise((resolve,reject)=>{
			Meteor.call('fetchTagForDashboard',(err,data)=>{
				if(err){
					reject(err)
				}else{
					dispatch(success_fetch_tag(data))
					/*if(data.length > 0){
						dispatch(success_fetch_action(data))
						resolve('Action loading completed')
					}else{
						dispatch(success_fetch_action(data))
						resolve('No action in database')
					}*/
				}
			})
		})
	}
}

export function success_fetch_tag( data ){
	return createAction( FETCH_TAG_FOR_DASH )( data )
}
/*export function saveAction(id,action){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('saveAction', id,action , (err, data) => {
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

export function fetchAction(){
	return (dispatch,getState)=>{
		return new Promise((resolve,reject)=>{
			Meteor.call('fetchAllAction',(err,data)=>{
				if(err){
					reject(err)
				}else{
					if(data.length > 0){
						dispatch(success_fetch_action(data))
						resolve('Action loading completed')
					}else{
						dispatch(success_fetch_action(data))
						resolve('No action in database')
					}
				}
			})
		})
	}
}



export function deleteAction( id ){
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

export function candidateAction(A_id, email_ids, key,value){
	return (dispatch,getState) => {
		return new Promise( (resolve, reject) => {
			Meteor.call('candidateActionTaken', A_id, email_ids, key,value, (err, data) =>{
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


import { createAction } from 'redux-actions'
import * as _ from 'lodash'
import {onAssignTag} from '../tags'

export const ACTION_ERROR_FETCH_ACTION = "ACTION_ERROR_FETCH_ACTION"
export const ACTION_SUCCESS_FETCH_ACTION = "ACTION_SUCCESS_FETCH_ACTION"
export const ACTION_UPDATE_PROGRESS_STATUS = "ACTION_UPDATE_PROGRESS_STATUS"
export const UPDATE_TAGID = "UPDATE_TAGID"


export function saveAction(id,action){
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


export function success_fetch_action( data ){
	return createAction( ACTION_SUCCESS_FETCH_ACTION )( data )
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

export function candidateAction(candidateIdList,name,sub,body,action_id,attachment,testing){
	return (dispatch,getState) => {
		return new Promise( (resolve, reject) => {
			Meteor.call('sendMailToCandidate',candidateIdList,name,sub,body,action_id,attachment,testing,Meteor.userId(),(err, data) =>{
				if(err){
					reject(err)
				}else{
					if(testing==true){
						resolve(data.Message)
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
}


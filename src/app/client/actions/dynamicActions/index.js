import { createAction } from 'redux-actions'
import * as _ from 'lodash'

export const ACTION_ERROR_FETCH_ACTION = "ACTION_ERROR_FETCH_ACTION"
export const ACTION_SUCCESS_FETCH_ACTION = "ACTION_SUCCESS_FETCH_ACTION"


export function saveAction(id,action){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('saveAction', id,action , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchAction() )
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
						resolve('Template loading completed')
					}else{
						resolve('No template in database')
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

/*export function fetchTemplate(){
	return (dispatch,getState)=>{
		return new Promise((resolve,reject)=>{
			Meteor.call('fetchAllTemplates',(err,data)=>{
				if(err){
					reject(err)
				}else{
					if(data.length > 0){
						dispatch(success_fetch_temptale(data))
						resolve('Template loading completed')
					}else{
						resolve('No template in database')
					}
				}
			})
		})
	}
}*/
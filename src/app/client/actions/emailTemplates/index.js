import { createAction } from 'redux-actions'
import * as _ from 'lodash'

export const ACTION_ERROR_FETCH_TEMPLATE = "ACTION_ERROR_FETCH_TEMPLATE"
export const ACTION_SUCCESS_FETCH_TEMPLATE = "ACTION_SUCCESS_FETCH_TEMPLATE"


export function saveTemplate( id, template ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('savetemplate', id, template , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchTemplate(data) )
					resolve(data)
				}
			})
		})
	}
}


export function deleteTemplate( id ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('deletetemplate', id , (err, data) => {
				if(err){
					reject(err)
				}else{
					if(typeof data.msg == 'undefined'){
						dispatch ( fetchTemplate() )
					    resolve('Template removed')
					}else{
						reject(data.msg); 
					}
					
				}
			})
		})
	}
}
export function success_fetch_temptale( data ){
	return createAction( ACTION_SUCCESS_FETCH_TEMPLATE )( data )
}

export function fetchTemplate(){
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
						dispatch(success_fetch_temptale(data))
						resolve('No template in database')
					}
				}
			})
		})
	}
}
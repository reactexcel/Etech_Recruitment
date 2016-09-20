import { createAction } from 'redux-actions'
import * as _ from 'lodash'

export const ACTION_SUCCESS_FETCH_USERS = "ACTION_SUCCESS_FETCH_USERS"
//export const ACTION_SUCCESS_FETCH_VARIABLE = "ACTION_SUCCESS_FETCH_VARIABLE"
//export const ACTION_UPDATE_PROGRESS_STATUS = "ACTION_UPDATE_PROGRESS_STATUS"
//export const UPDATE_TAGID = "UPDATE_TAGID"

export function addUsers(id,userDetail){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('addUsers', id,userDetail , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchUsers(data) )
					resolve(data)
				}
			})
		})
	}
}
export function fetchUsers(){
	return (dispatch,getState)=>{
		return new Promise((resolve,reject)=>{
			Meteor.call('fetchAllUser',(err,data)=>{
				if(err){
					reject(err)
				}else{
					if(data.length > 0){
						dispatch(success_fetch_user(data))
						resolve('Users loading completed')
					}else{
						dispatch(success_fetch_user(data))
						resolve('No user in database')
					}
				}
			})
		})
	}
}

export function deleteUser( id ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			Meteor.call('deleteUser', id , (err, data) => {
				if(err){
					reject(err)
				}else{
					dispatch ( fetchUsers(data) )
					resolve(data)
				}
			})
		})
	}
}


export function success_fetch_user( data ){
	return createAction( ACTION_SUCCESS_FETCH_USERS )( data )
}



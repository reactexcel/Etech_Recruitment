import { createAction } from 'redux-actions';
export const LOGIN = "LOGIN";

export function loginUser(email,password){
	return function(dispatch,getState){
		return new Promise((resolve,reject)=>{
			Meteor.loginWithPassword(email,password,(error)=>{
				if(error){
					reject(error)
				}else{
					let user={
						id: Meteor.userId(),
						email:email,
						password:password
					}
					dispatch(actionAfterLogin(user))
					resolve(user)
				}
			})
		})
	}
}
export function actionAfterLogin(user){
	return createAction(LOGIN)(user)
}
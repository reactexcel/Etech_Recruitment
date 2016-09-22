import { createAction } from 'redux-actions';
export const LOGIN = "LOGIN";
//export const LOADING = "LOADING";

/*export function loginUser(email,password,rememberme){
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
}*/
export function loginUser(email,password,rememberme){
	return function(dispatch,getState){
		return new Promise((resolve,reject)=>{
			Meteor.loginWithPassword(email,password,(error,result)=>{
				if(error){
					reject(error)
				}else{
					Meteor.call("user_remember_login", rememberme, function(error,data){
                    try{
                         if(rememberme){
                         	Accounts.config({loginExpirationInDays: 3650})
                         } 
                         else{
                         	Accounts.config({loginExpirationInDays: null})
                         } 
                        }catch(ex){
                          console.log(ex)
                        }
                   })
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
/*export function loading(show){
    return createAction(LOADING)(show)
}*/
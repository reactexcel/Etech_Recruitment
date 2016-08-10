import { createAction } from 'redux-actions';

export const ADD_USER = "ADD_USER";






export function registerUser(email, name, password){
	return function (dispatch, getState){
		return new Promise( (resolve, reject) => {
			Meteor.call('regUser', email, name, password, (err, id) => {
				if(err){
					reject(err)
				}else{
					let data = {
						id:id,
						email:email,
						name:name,
						password:password
					}
					dispatch(registerUserAction(data))
					resolve(data)
				}
			})
		})
	}
}

export const registerUserAction = (data) =>  createAction(ADD_USER)(data)

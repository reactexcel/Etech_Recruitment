import { createAction } from 'redux-actions'
import * as _ from 'lodash'


export function changePassword( oldpass, newpass ){
	return (dispatch,getState) => {
		return new Promise( (resolve,reject) => {
			if (Meteor.userId()) { 
        Accounts.changePassword(oldpass, newpass, (err)=>{
          if(!err){
            resolve("Password Changed")
          }else{
            reject("Error : Password Not Changed")
          }
        })
        }else{
          reject("Please login first")
        } 
		})
	}
}



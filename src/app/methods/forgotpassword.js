import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'


Meteor.methods({
  doUpdateUserPassword : function( emailid ){
    let newpassword = Math.floor((Math.random()*100000) + 900000).toString()
    let checkUser = Accounts.findUserByEmail( emailid )
    if( typeof checkUser != 'undefined' ){
      let userId = checkUser._id
      Accounts.setPassword( userId, newpassword)
      return {
        error : 0,
        message : 'Password changed',
        pass:newpassword
      }
    }else{
      return {
        error : 1,
        message : 'User not found',
        pass:''
      }
    }
  }
});
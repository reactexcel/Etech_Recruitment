import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  doUpdateUserPassword : function( emailid, newpassword ){
    var checkUser = Accounts.findUserByEmail( emailid )
    if( typeof checkUser != 'undefined' ){
      var userId = checkUser._id
      Accounts.setPassword( userId, newpassword)
      return {
        error : 0,
        message : 'Password changed'
      }
    }else{
      return {
        error : 1,
        message : 'User not found'
      }
    }
  }
});
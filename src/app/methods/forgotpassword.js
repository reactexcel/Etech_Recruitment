import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import {config_ENV} from '../config/index.jsx';

Meteor.methods({
  doUpdateUserPassword : function( emailid ){
    var newpassword = Math.floor((Math.random()*100000) + 900000).toString()
    var checkUser = Accounts.findUserByEmail( emailid )
    if( typeof checkUser != 'undefined' ){
      var userId = checkUser._id
      Accounts.setPassword( userId, newpassword)
          let email={
              to:emailid, 
              from:config_ENV.email._id, 
              subject:'Password reset',
              message:'Your New password is :<b>'+ newpassword + '</b> for email :'+ emailid
            }
            Meteor.call('sendMail',email)
      return {
        error : 0,
        message : 'Password changed',
      }
    }else{
      return {
        error : 1,
        message : 'User not found',
      }
    }
  }
});
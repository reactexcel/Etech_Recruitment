import {check} from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';
import Logs from 'app/collections/index';

Meteor.methods({
  'regUser' : function(email, name, password) {
    check(email, String)
    check(name, String)
    check(password, String)
    return Accounts.createUser({
      email: email,
      name: name,
      username: email,
      password: password
    })  
  },
  'log.insert':function(action_type,user_id,details){
    check(action_type,string)
    check(user_id,string)
    let logId = Logs.insert({
      action_type:action_type,
      user_id:user_id,
      details:details
    });
    let logDisplay={
      logId:logId,
      user_id:user_id,
      action_type:action_type,
      details:details
    }
    return logDisplay
  }

})

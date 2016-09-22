import {check} from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';
import Logs from 'app/collections/index';
//import Users from 'app/collections/users';

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
  'user_remember_login': function(rememberme){
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
  },
  'log.insert':function(action_type,user_id,details){
    let username=Meteor.users.findOne({"_id": user_id})
    let logId = Logs.insert({
      action_type:action_type,
      user_id:user_id,
      details:details,
      username:username.username,
      created_on:new Date()
    });
    let logDisplay={
      logId:logId,
      user_id:user_id,
      action_type:action_type,
      details:details,
      username:username.username
    }
    return logDisplay
  },
  'getlogsToDisplay' : function(){
    var allLogs = Logs.find( {}, {sort: {created_on: -1}}).fetch()
    console.log("in method")
    if( allLogs.length > 0 ){
      allLogs = _.map( allLogs, function( log ){
        let created_on = log.created_on
        log.created_on = moment(created_on).format("DD/MM/YYYY HH:mm:ss")
        return log
      })
    }
    return {
      logs : allLogs
    }
  }

})

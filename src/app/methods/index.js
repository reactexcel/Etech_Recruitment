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
  'log.insert':function(action_type,user_id,details){
    let logId = Logs.insert({
      action_type:action_type,
      user_id:user_id,
      details:details,
      created_on:new Date()
    });
    let logDisplay={
      logId:logId,
      user_id:user_id,
      action_type:action_type,
      details:details
    }
    return logDisplay
  },
  'getlogsToDisplay' : function(){
    var allLogs = Logs.find( {}, {sort: {created_on: -1}}).fetch()
    if( allLogs.length > 0 ){
      allLogs = _.map( allLogs, function( log ){
        let created_on = log.created_on
        log.created_on = moment(created_on).format("DD/MM/YYYY")
        let candidateEmail = log.candidateEmail
        log.candidateEmail=Meteor.users.findOne({"_id": log.user_id})
        console.log(log.candidateEmail)
        return log
      })
    }
    return {
      logs : allLogs
    }
  }

})

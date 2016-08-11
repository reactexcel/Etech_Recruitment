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
  'getlogsToDisplay' : function( log_per_page, page_num ){
    var next_page = page_num + 1

    var allLogs = Logs.find( {}, {sort: {created_on: -1},limit: log_per_page }).fetch()

    if( allLogs.length > 0 ){
      allLogs = _.map( allLogs, function( log ){
        let log_date = log.log_date
        log.log_date = moment(log_date).format("dddd, Do MMM")
        return log
      })
    }

    return {
    logs : allLogs,
    next_page : next_page
    }
  }

})

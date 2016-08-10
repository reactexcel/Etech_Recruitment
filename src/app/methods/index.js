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
    var skip = log_per_page * ( page_num - 1 )
    var next_page = page_num + 1
    var previous_page = page_num - 1
    if( previous_page == 0 ){
      previous_page = ''
    }

    var allLogs = Logs.find( {}, {limit: log_per_page }).fetch()

    if( allLogs.length > 0 ){
      allLogs = _.map( allLogs, function( log ){
        let log_date = log.log_date
        log.log_date = moment(log_date).format("dddd, Do MMM")
        return log
      })
    }

    return {
    logs : allLogs,
    previous_page : previous_page,
    next_page : next_page
    }
  }

})

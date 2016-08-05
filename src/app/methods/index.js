import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base';

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
  }

})


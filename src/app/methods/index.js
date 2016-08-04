import Users from 'app/collections/Users';
import {check} from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';

Meteor.methods({
  'account.create' : function(email,password) {
    check(email, String);
    check(password, String);
    return Accounts.createUser({
      email: email,
      username: email,
      password: password
    })  
  }

})
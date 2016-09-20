import { Meteor } from 'meteor/meteor'
import {check} from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import * as _ from 'lodash'

//import Variables from 'app/collections/variables'

Meteor.methods({
	"fetchAllUser" : function(){
       let users = Meteor.users.find({}).fetch()
       return users
    },
    "addUsers" : function(id,userDetails){
      check(userDetails.username, String)
      check(userDetails.email, String)
      check(userDetails.userType, String)
      check(userDetails.password, String)
    if(id != ''){
      Meteor.users.update(id, {
                $set: {
                    email: userDetails.email,
                    username: userDetails.username
                }
            });
      if(userDetails.password != ''){
        Accounts.setPassword(id, userDetails.password);
      }
      Roles.setUserRoles( id,userDetails.userType );
    }else{
      let userId = Accounts.createUser({
               email: userDetails.email,
               username: userDetails.username,
               password: userDetails.password
            })
      Roles.addUsersToRoles( userId, [userDetails.userType] );
      return userId
    }

  },
  "deleteUser":function(id){
         let _id = Meteor.users.remove(id); 
         return _id
  }
})
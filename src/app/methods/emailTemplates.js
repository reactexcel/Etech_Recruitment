import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailTemplates from 'app/collections/emailTemplates';
import DynamicActions from 'app/collections/dynamicAction'


Meteor.methods({
  fetchAllTemplates : function(){
    return EmailTemplates.find({}).fetch();
  },
  savetemplate : function(id,template){
    if(id != ''){
      let _id = EmailTemplates.update(id,{$set: template})
      return _id;
    }else{
      let _id=EmailTemplates.insert( template )
      return _id;
    }
  },
  deletetemplate : function( id ){
    let action = DynamicActions.find({template_id: id}).fetch();
    if(action.length>0){
      return{
        msg:"Template is already assigned to some action, Unable to delete!"
      }
    }else{
      let result = EmailTemplates.remove(id)
      return (result);
    }
  }
});


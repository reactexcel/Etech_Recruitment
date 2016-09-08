import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailTemplates from 'app/collections/emailTemplates'


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
    let template = EmailTemplates.find({actions:{$size:0}}).count()
    if(template > 0){
      let _id = EmailTemplates.remove(id)
      return _id
    }else{
      return 0
    }
  }
});


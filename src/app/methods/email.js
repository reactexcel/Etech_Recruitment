import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'


Meteor.methods({
  getEmail : function(email_id){
    var emailData = EmailsStore.find({_id : email_id}).fetch()
    if( emailData.length > 0 ){
      emailData = _.map( emailData, function( email ){
        let email_date = email.email_date
        email.email_date = moment(email_date).format("dddd, Do MMM")
        return email
      })
    }
    return emailData
  },
  tagsUpdateArchive : function(id, status){
    if(status!='undefined'){
      EmailsStore.update(
      { _id: id, 'tags.Archive':status },
      { $set: { 'tags.$.Archive':!status } }
      )
    }else{
      EmailsStore.update(
      { _id: id },
      { $addToSet: { tags: { $each: [ {"Archive":true}] } } }
      )
    }
  },
  tagUpdateReject : function(id,reject, reason){
    if(reject!='undefined'){
      EmailsStore.update(
      { _id: id, 'tags.Reject':reject },
      { $set: { 'tags.$.Reject':!reject,'tags.$.Reason':reason } }
      )
    }else{
      EmailsStore.update(
      { _id: id },
      { $push: { tags: { $each: [ {"Reject":true, "Reason":reason}] } } }
      )
    }
  },
});


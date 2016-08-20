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
  tagUpdateArchive : function(id,tagId,status){
    let mail = EmailsStore.find({"_id": id}).fetch();
    if(mail.tags != 'undefined'){
      if(status=="ignore"){
        EmailsStore.update(
          { _id: id },
          { $addToSet: { 'tags': tagId} }
        )
      }else{
        EmailsStore.update(
          { _id: id },
          {$pull:{tags:tagId}}
          )
      }

     
    }else{
     EmailsStore.update(
     { _id: id },
     { $set: { 'tags': [tagId ] }} ,{upsert:false, multi:true}
     )
    }
  },
  tagUpdateReject : function(id,tagId,reason){
    let mail = EmailsStore.find({"_id": id}).fetch();
    if(mail.tags != 'undefined'){
        EmailsStore.update(
          { _id: id },
          { $addToSet: { 'tags': tagId},$set:{'Reason_of_rejection':reason} }
        )
    }else{
        EmailsStore.update(
          { _id: id },
          { $set: { 'tags': [tagId ],'Reason_of_rejection':reason }} ,{upsert:false, multi:true}
        )
    }
  },
});


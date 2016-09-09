import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import DynamicActions from 'app/collections/dynamicAction'
import CandidateHistory from 'app/collections/candidateHistory' 

Meteor.methods({
  getEmail : function(email_id){
    EmailsStore.update({_id: email_id},{$set :{m_read_status: 1}});
    var emailData = EmailsStore.find({_id : email_id}).fetch()
    //---
    let allAction = DynamicActions.find({}).fetch()
      let totalPoints = 0
      _.map(allAction,(act)=>{
        totalPoints = (parseInt(totalPoints)+parseInt(act.progress_point))
      })
      //---
    if( emailData.length > 0 ){
      emailData = _.map( emailData, function( email ){
        //-------
        let history = CandidateHistory.find({email_id:email._id}).fetch()
        if(history.length > 0){
          email.progresStatus = typeof history[0].progress_point !== 'undefined'?(history[0].progress_point/totalPoints*100):0
          email.candidateActions =  typeof history[0].dynamicActions !== 'undefined'?history[0].dynamicActions:[]
        }else{
          email.progresStatus = 0
        }
        //-------
        let email_date = email.email_date
        email.email_date = moment(email_date).format("dddd, Do MMM")
        return email
      })
    }
    return emailData
  },
  fetchaction : function(){
    
  },
  //----------
  tagUpdateArchive : function(id,tagId){
    let mail = EmailsStore.find({"_id": id}).fetch();
    if(mail.tags != 'undefined'){
        EmailsStore.update(
          { _id: id },
          { $addToSet: { 'tags': tagId} }
        )
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
  //---------
});

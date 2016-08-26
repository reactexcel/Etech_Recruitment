import { Meteor } from 'meteor/meteor';
import Tags  from './../../collections/inboxTag';
import EmailsStore from './../../collections/EmailsStore'
import {config_ENV} from './../../config/index.jsx'
import _ from 'lodash'
import Logs from 'app/collections/index';
import CandidateHistory from 'app/collections/candidateHistory'

Meteor.methods({
  "fetchTag": function(){
    return Tags.find({}).fetch();
  },
  "addTag": function(tag){
    let id;
    if(tag.automatic)
      id = Tags.insert({
        name: tag.name,
        color: tag.color,
        from: tag.from,
        to: tag.to,
        email: tag.email,
        automatic: tag.automatic,
      });
    else
      id = Tags.insert({
        name: tag.name,
        color: tag.color,
        automatic: tag.automatic,
      });
      tag._id = id;
    return (tag);
  },
  "editTag": function(_id, title, color){
    Tags.update({"_id": _id},{$set:{ name: title, color: color }});
    return ({name: title, color: color, _id: _id});
  },
  "removeTag": function(_id){
    Tags.remove({"_id": _id});
    return ({_id: _id});
  },
  "assignTag": function (m_id, t_id){
    let mail = EmailsStore.find({"_id": m_id}).fetch();
    if(mail.tags != 'undefined'){
      EmailsStore.update(
      { _id: m_id },
      { $addToSet: { 'tags': t_id} }
      )
    }else{
      EmailsStore.update(
      { _id: m_id },
      { $set: { 'tags': [t_id ] }} ,{upsert:false, multi:true}
      )
    }
    return EmailsStore.find({"_id": m_id}).fetch();
  },
  "ignoreMultipleCandidate": function (idList, tagId, userId){
    var mail;
    var email_id;
    var currentDate = new Date();
     _.map(idList,(id)=>{
      email_id = CandidateHistory.find({"email_id":id}).fetch()
       mail = EmailsStore.find({"_id": id}).fetch();
       if(mail.tags != 'undefined'){
        if(_.includes(mail.tags,tagId)==false){
          EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId} }
             );
        }
       }else{
          EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ] }} ,{upsert:false, multi:true}
           );
       }
       if(_.includes(mail.tags,tagId)==false){
         Logs.insert({
                action_type:"Candidate is moved to ignore tag",
                user_id:userId,
                details:"Action apply on Candidate id : "+id,
                created_on:new Date()
             });
             if(email_id.length===0){
                 CandidateHistory.insert({
                   email_id:id,
                   historyDetails:[{
                    "ignored":true,
                    "date":currentDate,
                    "detail":"Candidate is Moved to Ignore tag"
                  }]
                 });
             }else{
                CandidateHistory.update(
                  { email_id: id },
                  { $addToSet: {'historyDetails':{"ignored":true,"date":currentDate,"detail":"Candidate is Moved to Ignore tag"}}}
                );
             }
       }

     })
     return EmailsStore.find({}).fetch();
  },
  "rejectMultipleCandidate": function (idList, tagId, reason, userId){
       var mail;
       var email_id;
       var currentDate = new Date();
     _.map(idList,(id)=>{
      email_id = CandidateHistory.find({"email_id":id}).fetch()
       mail = EmailsStore.find({"_id": id}).fetch();
       if(mail.tags != 'undefined'){
          if(_.includes(mail.tags,tagId)==false){
            EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId},$set:{'Reason_of_rejection':reason} }
             );
          }
       }else{
          EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ],'Reason_of_rejection':reason }} ,{upsert:false, multi:true}
           );
       }
       if(_.includes(mail.tags,tagId)==false){
          Logs.insert({
                action_type:"Candidate is moved to reject tag",
                user_id:userId,
                details:"Action apply on candidate id"+id,
                created_on:new Date()
             });
          if(email_id.length===0){
                 CandidateHistory.insert({
                   email_id:id,
                   historyDetails:[{
                    "rejected":true,
                    "date":currentDate,
                    "detail":"Candidate is Moved to Ignore tag",
                    "reason":reason
                  }]
                 });
             }else{
                CandidateHistory.update(
                  { email_id: id },
                  { $addToSet: { 'historyDetails':{"rejected":true,"date":currentDate,"detail":"Candidate is Moved to Reject tag","reason":reason}}}
                );
             }
       }
     })
     return EmailsStore.find({}).fetch();
  },
});

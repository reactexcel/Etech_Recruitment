import { Meteor } from 'meteor/meteor';
import Tags  from './../../collections/inboxTag';
import EmailsStore from './../../collections/EmailsStore'
import {config_ENV} from './../../config/index.jsx'
import _ from 'lodash'
import Logs from 'app/collections/index';

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
     _.map(idList,(id)=>{
       mail = EmailsStore.find({"_id": id}).fetch();
       if(mail.tags != 'undefined'){
         if(_.includes(mail.tags,tagId)==false){
             EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId} }
             );
             Logs.insert({
                action_type:"Candidate is moved to ignore tag",
                user_id:userId,
                details:"Action apply on Candidate id : "+id,
                created_on:new Date()
             });
         }
       }else{
           EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ] }} ,{upsert:false, multi:true}
           );
           Logs.insert({
                action_type:"Candidate is moved to ignore tag",
                user_id:userId,
                details:"Action apply on Candidate id : "+id,
                created_on:new Date()
             });
      }
     })
     return EmailsStore.find({}).fetch();
  },
  "rejectMultipleCandidate": function (idList, tagId, reason, userId){
    var mail;
     _.map(idList,(id)=>{
       mail = EmailsStore.find({"_id": id}).fetch();
       if(mail.tags != 'undefined'){
         if(_.includes(mail.tags,tagId)==false){
             EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId},$set:{'Reason_of_rejection':reason} }
             );
             Logs.insert({
                action_type:"Candidate is moved to reject tag",
                user_id:userId,
                details:{"Action apply on candidate id" :id,"Reason of rejection":reason},
                created_on:new Date()
             });
         }
       }else{
           EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ],'Reason_of_rejection':reason }} ,{upsert:false, multi:true}
           );
           Logs.insert({
                action_type:"Candidate is moved to reject tag",
                user_id:userId,
                details:{"Action apply on candidate id" :id,"Reason of rejection":reason},
                created_on:new Date()
             });
      }
     })
     return EmailsStore.find({}).fetch();
  },
});

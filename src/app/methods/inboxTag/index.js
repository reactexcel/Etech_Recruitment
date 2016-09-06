import { Meteor } from 'meteor/meteor';
import Tags  from './../../collections/inboxTag';
import EmailsStore from './../../collections/EmailsStore'
import {config_ENV} from './../../config/index.jsx'
import _ from 'lodash'
import Logs from 'app/collections/index';
import CandidateHistory from 'app/collections/candidateHistory';
import { Email } from 'meteor/email';

Meteor.methods({
  "fetchTag": function(){
    return Tags.find({}).fetch();
  },
  "addTag": function(tag){
    let id;
    if(Tags.find({name: tag.name}).count() >0){
      return 'Tag name already exists';
    }
    if(tag.automatic)
      id = Tags.insert({
        name: tag.name,
        color: tag.color,
        from: tag.from,
        to: tag.to,
        email: tag.email,
        subject: tag.subject,
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
    EmailsStore.update({},{$pull:{'tags':_id}})
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
    return {email:EmailsStore.find({"_id": m_id}).fetch(),tagId:t_id};
  },
  "ignoreMultipleCandidate": function (idList, tagId, userId){
    let username=Meteor.users.findOne({"_id": userId})
    var mail;
    var email_id;
    var currentDate = new Date();
    var newIdList = [];
     _.map(idList,(id)=>{
      email_id = CandidateHistory.find({"email_id":id}).fetch()
       mail = EmailsStore.find({"_id": id}).fetch();
       if(mail[0].tags != 'undefined'){
        if(_.includes(mail[0].tags,tagId)==false){
          EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId} }
             );
          newIdList.push(id)
        }
       }else{
          EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ] }} ,{upsert:false, multi:true}
           );
          newIdList.push(id)
       }
       if(_.includes(mail[0].tags,tagId)==false){
         Logs.insert({
                action_type:"Candidate is moved to ignore tag",
                user_id:userId,
                details:"Action apply on Candidate : "+mail[0].from,
                username:username.username,
                created_on:new Date()
             });
             if(email_id.length===0){
                 CandidateHistory.insert({
                   email_id:id,
                   progresStatus:4,
                   historyDetails:[{
                    "ignored":true,
                    "date":currentDate,
                    "detail":"Candidate is Moved to Ignore tag",
                    "actionPerformedBy":username.username
                  }]
                 });
             }else{
                CandidateHistory.update(
                  { email_id: id },
                  { $addToSet: {'historyDetails':{"ignored":true,"date":currentDate,"detail":"Candidate is Moved to Ignore tag","actionPerformedBy":username.username}}}
                );
             }
       }

     })
     let ignrReturn=[]
     _.map(newIdList,(id)=>{
      let data = EmailsStore.find({"_id": id}).fetch()
      ignrReturn.push(data[0])
     })
     return {email:ignrReturn,tagId:tagId};
  },
  "rejectMultipleCandidate": function (idList, tagId, reason, userId){
    let username=Meteor.users.findOne({"_id": userId})
       var mail;
       var email_id;
       var currentDate = new Date();
       var newIdList = [];
     _.map(idList,(id)=>{
      email_id = CandidateHistory.find({"email_id":id}).fetch()
       mail = EmailsStore.find({"_id": id}).fetch();
       if(mail[0].tags != 'undefined'){
          if(_.includes(mail[0].tags,tagId)==false){
            EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId} }
             );
            newIdList.push(id)
          }
       }else{
          EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ] }} ,{upsert:false, multi:true}
           );
          newIdList.push(id)
       }
       if(_.includes(mail[0].tags,tagId)==false){
          Logs.insert({
                action_type:"Candidate is moved to reject tag",
                user_id:userId,
                details:"Action apply on candidate :"+mail[0].from,
                username:username.username,
                created_on:new Date()
             });
          if(email_id.length===0){
                 CandidateHistory.insert({
                   email_id:id,
                   progresStatus:4,
                   historyDetails:[{
                    "rejected":true,
                    "date":currentDate,
                    "detail":"Candidate is Moved to Reject tag",
                    "reason":reason,
                    "actionPerformedBy":username.username
                  }]
                 });
             }else{
                CandidateHistory.update(
                  { email_id: id },
                  { $addToSet: { 'historyDetails':{"rejected":true,"date":currentDate,"detail":"Candidate is Moved to Reject tag","reason":reason,"actionPerformedBy":username.username}}}
                );
             }
       }
     })
  let ignrReturn=[]
     _.map(newIdList,(id)=>{
      let data = EmailsStore.find({"_id": id}).fetch()
      ignrReturn.push(data[0])
     })
     return {email:ignrReturn,tagId:tagId};
  },
  "sendMailToCandidate" : function(candidateIdList,name,sub,body,tagId,userId){
    let username=Meteor.users.findOne({"_id": userId})
    var mail;
    var email_id;
    let newIdList=[];
    var currentDate = new Date();
    _.map(candidateIdList,(id)=>{
       email_id = CandidateHistory.find({"email_id":id}).fetch()
       mail = EmailsStore.find({"_id": id}).fetch();
       /*----------------------------Send email start---------------------------*/
      if (Meteor.isServer) {
      Email.send({
        "headers": {
          'Content-Type': 'text/html; charset=UTF-8'
        },
        //"to": mail[0].sender_mail,
        "to": 'abhi.jsmj1993@gmail.com',
        "from": username.username,
        "subject": sub,
        'text': body
      });
    }
      /*------------------------------Send email end----------------------------*/
      if(mail[0].tags != 'undefined'){
          if(_.includes(mail[0].tags,tagId)==false){
            EmailsStore.update(
               { _id: id },
               { $addToSet: { 'tags': tagId} }
             );
            newIdList.push(id)
          }
       }else{
          EmailsStore.update(
             { _id: id },
             { $set: { 'tags': [tagId ] }} ,{upsert:false, multi:true}
           );
          newIdList.push(id)
       }
       Logs.insert({
                action_type:"Candidate is Scheduled for "+name,
                user_id:userId,
                details:"Action apply on candidate :"+mail[0].from,
                username:username.username,
                created_on:new Date()
             });
       if(email_id.length===0){
                 CandidateHistory.insert({
                   email_id:id,
                   progresStatus:0,
                   historyDetails:[{
                    "scheduled":true,
                    "date":currentDate,
                    "detail":"Candidate is Scheduled for "+name,
                    "actionPerformedBy":username.username
                  }]
                 });
             }else{
                CandidateHistory.update(
                  { email_id: id },
                  { $addToSet: { 'historyDetails':{"scheduled":true,"date":currentDate,"detail":"Candidate is Scheduled for "+name,"actionPerformedBy":username.username}}}
                );
             }
    })
   // return {emailIdList:candidateIdList,tagId:tagId}
   let ignrReturn=[]
     _.map(newIdList,(id)=>{
      let data = EmailsStore.find({"_id": id}).fetch()
      ignrReturn.push(data[0])
     })
     return {email:ignrReturn,tagId:tagId};

   }


});

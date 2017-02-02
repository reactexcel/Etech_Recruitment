import { Meteor } from 'meteor/meteor';
import Tags  from './../../collections/inboxTag';
import EmailsStore from './../../collections/EmailsStore'
import {config_ENV} from './../../config/index.jsx'
import _ from 'lodash'
import Logs from 'app/collections/index';
import CandidateHistory from 'app/collections/candidateHistory';
import { Email } from 'meteor/email';
import DynamicActions from 'app/collections/dynamicAction'
import MailComposer from 'mailcomposer'
var nodemailer = require('nodemailer');

Meteor.methods({
  "fetchTag": function(){
    return Tags.find({}).fetch();
  },
  "addTag": function(tag){
    let id;
    if(Tags.find({name: tag.name}).count() >0){
      return 'Tag name already exists';
    }
    if(tag.automatic){
      id = Tags.insert({
        name: tag.name,
        color: tag.color,
        from: tag.from || '',
        to: tag.to || '',
        email: tag.email || '',
        subject: tag.subject,
        automatic: tag.automatic,
        showOnReport:tag.showOnReport
      });
    }else if(tag.dynamicAction){
      id = Tags.insert({
        name: tag.name,
        color: tag.color,
        dynamicAction: true,
      });
    }else
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
    let action = DynamicActions.find({tag_id: _id}).fetch();
    if(action.length>0){
       return {
           msg:"Tag is already assigned to some action, Unable to delete!"
       }
    }else{
       Tags.remove({"_id": _id});
       EmailsStore.update({},{$pull:{'tags':_id}})
       return ({_id: _id});
    }
    
  },
  "assignTag": function (mailIds, t_id){
    let emails = []
    _.map(mailIds,(m_id)=>{
      let mail = EmailsStore.find({"_id": m_id}).fetch();
      mail = mail[0] ;
    if(typeof mail.tags != 'undefined'){
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
    let tmp = EmailsStore.find({"_id": m_id}).fetch()
    emails.push(tmp[0])
    })
    return {email:emails,tagId:t_id};
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
  "sendMailToCandidate" : function(candidateIdList,name,sub,body,action_id,attachment,userId){
    let action = DynamicActions.find({_id:action_id}).fetch()
    let tag = Tags.find({_id:action[0].tag_id}).fetch()
    let username=Meteor.users.findOne({"_id": userId})
    var currentDate = new Date()
    let successMail = []
    let failed = []
    let prograsStatus = []
    _.map(candidateIdList,(emailId)=>{
      let email = EmailsStore.find({_id : emailId}).fetch()
      try{
        /*-------------------Email send---------------------------*/
        var transporter = nodemailer.createTransport('smtps://abhishek@excellencetechnologies.in:nKR9ENcoWmAtGZL@smtp-pulse.com:465');
        var mailOptions = {
          from: 'abhishek@excellencetechnologies.in',
          //"from": mail[0].m_source_email_id,
          to: 'excellenceseo@gmail.com',
          //"to": mail[0].sender_mail,
          subject: sub,
          html: body,
          attachments: attachment
        };
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });
        /*-------------------Email send completed---------------------------*/
        //----Update User activity logs---------
        Logs.insert({
          action_type:"Candidate is moved to "+tag[0].name+" tag",
          user_id:Meteor.userId(),
          details:"Action apply on Candidate : "+email[0].from,
          username:username.username,
          created_on:new Date()
        });
        //---
        let history = CandidateHistory.find({email_id:email[0]._id}).fetch()
        let candidatePoints;
        if(history.length === 0){
          candidatePoints = action[0].progress_point
          CandidateHistory.insert({
            email_id:email[0]._id,
            progress_point:candidatePoints,
            dynamicActions:[action[0]._id],
            historyDetails:[{
              "action":action[0].name,
              "date":currentDate,
              "detail":"Action Taken: "+action[0].name,
              "actionPerformedBy":username.username
            }]
          });
        }else{
          if(typeof history[0].progress_point !== 'undefined'){
            candidatePoints = history[0].progress_point + action[0].progress_point
          }else{
            candidatePoints = action[0].progress_point
          }
          if(typeof history[0].dynamicActions!=='undefined'){
            CandidateHistory.update(
                { email_id: email[0]._id },
                { $set:{progress_point:candidatePoints},
                  $addToSet: {
                    'dynamicActions':action[0]._id,
                    'historyDetails':{
                    "action":action[0].name,
                    "date":currentDate,
                    "detail":"Action Taken: "+action[0].name,
                    "actionPerformedBy":username.username
                  }}}
            );
          }else{
            CandidateHistory.update(
              { email_id: email[0]._id },
              { $set:{progress_point:candidatePoints,dynamicActions:[action[0]._id],},
                  $addToSet: {
                    'historyDetails':{
                    "action":action[0].name,
                    "date":currentDate,
                    "detail":"Action Taken: "+action[0].name,
                    "actionPerformedBy":username.username
                  }
              }}
            );
          }
        }
        //--------Fetching updated progress status
        let allAction = DynamicActions.find({}).fetch()
        let totalPoints = 0
        _.map(allAction,(act)=>{
          totalPoints = (parseInt(totalPoints)+parseInt(act.progress_point))
        })
        let updatedHistory = CandidateHistory.find({email_id:email[0]._id}).fetch()
        prograsStatus.push({emailId:email[0]._id,progress:(candidatePoints/totalPoints*100),candidateAction:updatedHistory[0].dynamicActions})
        successMail.push(email[0]._id)
      }catch(e){
        failed.push(email[0].sender_mail)
        console.log(e)
      }
    }) 
    return {
    successMail:successMail,
    failedMail:failed,
    tag:tag[0],
    prograsStatus:prograsStatus,
    emailIdS:candidateIdList
  }
    /*let username=Meteor.users.findOne({"_id": userId})
    var mail;
    var email_id;
    let newIdList=[];
    var currentDate = new Date();
    _.map(candidateIdList,(id)=>{
       email_id = CandidateHistory.find({"email_id":id}).fetch()
       mail = EmailsStore.find({"_id": id}).fetch();
       
        var transporter = nodemailer.createTransport('smtps://abhishek@excellencetechnologies.in:nKR9ENcoWmAtGZL@smtp-pulse.com:465');
        var mailOptions = {
          from: 'abhishek@excellencetechnologies.in',
          //"from": mail[0].m_source_email_id,
          to: 'excellenceseo@gmail.com',
          //"to": mail[0].sender_mail,
          subject: sub,
          html: body,
          attachments: attachment
          };
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
              return console.log(error);
            }
            console.log('Message sent: ' + info.response);
          });
      
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
    */
   },
   "removeTagFromCandidate" : function(emailId, tagId){
    let res = EmailsStore.update({_id:emailId},{$pull:{'tags':tagId}})
    let data = EmailsStore.find({"_id": emailId}).fetch()
     return {result:res,email:data[0]}
   }


});

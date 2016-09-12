import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'
import DynamicActions from 'app/collections/dynamicAction'
import Tags  from 'app/collections/inboxTag';
import EmailTemplates from 'app/collections/emailTemplates'
import EmailsStore from 'app/collections/EmailsStore'
import CandidateHistory from 'app/collections/candidateHistory'

Meteor.methods({
	"fetchAllAction" : function(){
       let actions = DynamicActions.find({}).fetch();
       let newActionList = [];
       _.map(actions,(data,key)=>{
        let tag = Tags.find({_id: data.tag_id}).fetch();
        let template = EmailTemplates.find({_id: data.template_id}).fetch();
          newActionList.push({
            "_id": data._id,
            "name": data.name,
            "template_id": data.template_id,
            "tag_id":data.tag_id,
            "progress_point":data.progress_point,
            "tag_name":tag[0].name,
            "tag_color":tag[0].color,
            "template_name":template[0].name
          })
       })
       return newActionList
    },
    "saveAction" : function(id,action){
    if(id != ''){
      let _id = DynamicActions.update({"_id":id},{$set:{
        name:action.name,
        template_id:action.templateId,
        tag_id:action.tagId,
        progress_point:1
      }})
      return _id;
    }else{
           let _id = DynamicActions.insert( {
              name:action.name,
              template_id:action.templateId,
              tag_id:action.tagId,
              progress_point:1
            } )
            return _id;
    }

  },
  "deleteAction":function(id){
         let _id = DynamicActions.remove(id)
         return _id
  },
  "candidateActionTaken":function(A_id, email_ids){
    let action = DynamicActions.find({_id:A_id}).fetch()
    let template = EmailTemplates.find({_id:action[0].template_id}).fetch()
    let tag = Tags.find({_id:action[0].tag_id}).fetch()
    let username=Meteor.users.findOne({"_id": Meteor.userId()})
    var currentDate = new Date()
    let successMail = []
    let failed = []
    let prograsStatus = []
    _.map(email_ids,(emailId)=>{
      let email = EmailsStore.find({_id : emailId}).fetch()
      try{/*
      Email.send({
        "headers": {
          'Content-Type': 'text/html; charset=UTF-8'
        },
        "to": 'atul@excellencetechnologies.in',//email[0].sender_mail,
        "from": email[0].m_source_email_id,
        "subject": template[0].subject,
        'text':template[0].content
      });
     */
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
    tag:tag[0]._id,
    prograsStatus:prograsStatus,
  }
  }
})

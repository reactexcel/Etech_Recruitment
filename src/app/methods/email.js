
import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import Config from 'app/collections/config'
import DynamicActions from 'app/collections/dynamicAction'
import CandidateHistory from 'app/collections/candidateHistory'
import {config_ENV} from './../config';
import { HTTP } from 'meteor/http'

Meteor.methods({
  getEmail : function(email_id){
    const user_id =  Meteor.userId();
    this.unblock();
    EmailsStore.update({_id: email_id},{$set :{unread: false}});
    var emailData = EmailsStore.find({_id : email_id}).fetch();
    let allAction = DynamicActions.find({}).fetch()
      let totalPoints = 0
      _.map(allAction,(act)=>{
        totalPoints = (parseInt(totalPoints)+parseInt(act.progress_point))
      })
    if( emailData.length > 0 ){
      emailData = _.map( emailData, function( email ){
        let history = CandidateHistory.find({email_id:email._id}).fetch()
        if(history.length > 0){
          email.progresStatus = typeof history[0].progress_point !== 'undefined'?(history[0].progress_point/totalPoints*100):0
          email.candidateActions =  typeof history[0].dynamicActions !== 'undefined'?history[0].dynamicActions:[]
        }else{
          email.progresStatus = 0
        }
        let email_date = email.email_date
        email.email_date = moment(email_date).format("dddd, Do MMM")
        return email
      })
    }
    //----------custom------
    let emailAttachments = [];
    if(typeof emailData[0].attachments !== 'undefined'){
      emailAttachments.push(emailData[0]);
    }
    if(typeof emailData[0].more_emails !== 'undefined'){
      _.map(emailData[0].more_emails,(email)=>{
        if(typeof email.attachments !== 'undefined'){
          emailAttachments.push(email);
        }
      })
    }
    let i = 0;
    if(emailAttachments.length > 0){
      _.map(emailAttachments,(email)=>{
        if(typeof email.attachments[0].link == 'undefined'){
          SyncedCron.add({
            name: email.email_id.toString(),
            emailData: email,
            user_id: user_id,
            BASE_URL: config_ENV._BASE_URL,
            PARAMS: function(){
                let imapEmails = this.server();
                _.forEach(imapEmails, (e) => {
                  if(typeof e.smtp == 'undefined'){
                    this.imapEmail = e;
                  }
                });
                  return  "email="+this.imapEmail.emailId+
                          "&pass="+this.imapEmail.password+
                          "&date="+ moment(this.emailData.email_timestamp).format('YYYY-MM-DD')+
                          "&host="+this.imapEmail.server+
                          "&port="+this.imapEmail.port+
                          "&encryp="+this.imapEmail.encrypt+
                          "&email_id="+this.emailData.email_id;
                        },
            API_URL: function(){ return this.BASE_URL + this.PARAMS();},
            server: function(){return Config.find({emailId: this.emailData.m_source_email_id}).fetch()},
            imapEmail: {},
            schedule: function(parser) {
              return parser.text('every 2 secs');
            },
            job: function() {
              try{
                let response = HTTP.call("GET", this.API_URL() );
                let responseData = response.content
                let jsonData = [];
                if( typeof responseData != 'undefined' ){
                  jsonData = JSON.parse( responseData );
                }

                if( jsonData.data.length > 0 ){
                  if(this.emailData.email_id == emailData[0].email_id){
                    EmailsStore.update({_id: email_id},{$set:{ attachments: jsonData.data[0].attachments}});
                    console.log(EmailsStore.find({_id: email_id}).fetch()[0].attachments);
                    i++;
                  }else{
                    EmailsStore.update({_id: email_id, "more_emails.email_id":this.emailData.email_id},
                      {$set:{ "more_emails.$.attachments": jsonData.data[0].attachments}});
                      console.log(EmailsStore.find({_id: email_id, "more_emails.email_id":this.emailData.email_id}).fetch()[0].attachments);
                      i++;
                  }
                  if(emailAttachments.length <= i ){
                    Meteor.call('getAttchementUpdatedMail', email_id, this.user_id );
                  }

                  SyncedCron.remove(this.name);
                }
              }catch(err){
                console.log("ERR in method firstEmail -->> ",err);
              }
            }
          });
        }else{
          console.log('attachment Link is already available');
        }
      });
    }

    return emailData
  },
  getAttchementUpdatedMail : function(email_id, user_id){
    let emailData = EmailsStore.find({_id : email_id}).fetch();
    let allAction = DynamicActions.find({}).fetch()
      let totalPoints = 0
      _.map(allAction,(act)=>{
        totalPoints = (parseInt(totalPoints)+parseInt(act.progress_point))
      })
    if( emailData.length > 0 ){
      emailData = _.map( emailData, function( email ){
        let history = CandidateHistory.find({email_id:email._id}).fetch()
        if(history.length > 0){
          email.progresStatus = typeof history[0].progress_point !== 'undefined'?(history[0].progress_point/totalPoints*100):0
          email.candidateActions =  typeof history[0].dynamicActions !== 'undefined'?history[0].dynamicActions:[]
        }else{
          email.progresStatus = 0
        }
        let email_date = email.email_date
        email.email_date = moment(email_date).format("dddd, Do MMM")
        return email
      })
    }
    Meteor.ClientCall.apply(user_id, 'updateAttachment', [emailData], function(err ){
      console.log('Done!');
    });
  },
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
});

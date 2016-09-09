import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import Config from 'app/collections/config'
import {config_ENV} from './../config';
import { HTTP } from 'meteor/http'

Meteor.methods({
  getEmail : function(email_id, dispatch, updateState){
    this.unblock();
    console.log(updateState);
    EmailsStore.update({_id: email_id},{$set :{unread: false}});
    var emailData = EmailsStore.find({_id : email_id}).fetch();
    if( emailData.length > 0 ){
      emailData = _.map( emailData, function( email ){
        let email_date = email.email_date
        email.email_date = moment(email_date).format("dddd, Do MMM")
        return email
      })
    }
    SyncedCron.add({
      name: email_id,
      dispatch: dispatch,
      updateState: updateState,
      emailData: emailData[0],
      BASE_URL: config_ENV._BASE_URL,
      PARAMS: function(){
          let imapEmails = this.server();
          _.forEach(imapEmails, (e) => {
            if(typeof e.smtp == 'undefined'){
              this.imapEmail = e;
            }
          });
          console.log(this.imapEmail);
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
        return parser.text('every 10 secs');
      },
      job: function() {
        try{
          let response = HTTP.call("GET", this.API_URL() );
          let responseData = response.content
          let jsonData = [];
          if( typeof responseData != 'undefined' ){
            jsonData = JSON.parse( responseData );
          }
          console.log(jsonData);
          if( jsonData.data.length > 0 ){
            EmailsStore.update({_id: this.email_id},{$set:{ attachments: jsonData.data[0].attachments}});
            this.dispatch(this.updateState(jsonData.data[0]));
            SyncedCron.remove(this.name);
          }
        }catch(err){
          console.log("ERR in method firstEmail -->> ",err);
        }
      }

    });
    return emailData
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

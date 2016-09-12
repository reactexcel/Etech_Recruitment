
import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import Config from 'app/collections/config'
import {config_ENV} from './../config';
import { HTTP } from 'meteor/http'

Meteor.methods({
  getEmail : function(email_id){
    const user_id =  Meteor.userId();
    this.unblock();
    EmailsStore.update({_id: email_id},{$set :{unread: false}});
    var emailData = EmailsStore.find({_id : email_id}).fetch();
    if( emailData.length > 0 ){
      emailData = _.map( emailData, function( email ){
        let email_date = email.email_date
        email.email_date = moment(email_date).format("dddd, Do MMM")
        return email
      })
    }
    //if( typeof emailData.attachments.link == 'undefined'){

      SyncedCron.add({
        name: email_id,
        emailData: emailData[0],
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
            if( jsonData.data.length > 0 ){
              EmailsStore.update({_id: this.name},{$set:{ attachments: jsonData.data[0].attachments}});
              console.log(EmailsStore.find({_id: this.name}).fetch()[0].attachments);
              Meteor.ClientCall.apply(this.user_id, 'updateAttachment', [jsonData.data], function(err ){
                console.log('Done!');
              });
              SyncedCron.remove(this.name);
            }
          }catch(err){
            console.log("ERR in method firstEmail -->> ",err);
          }
        }
      });
    //}
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

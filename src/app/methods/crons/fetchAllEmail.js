import * as _ from 'lodash'
import { Meteor } from 'meteor/meteor'
import EmailsStore from '../../collections/EmailsStore';
import Config from '../../collections/config'
import {matchTag} from '../inboxTag/matchTag';
import {config_ENV} from './../../config';
import { HTTP } from 'meteor/http'

//m_insert_timestamp

Meteor.methods({
  fetchAllEmail: function( _id ){
    let imapEmail = Config.find({'_id': _id}).fetch();
    let resumeCronProcess = false;
    if(imapEmail.length > 0){
      Config.update({ _id: _id },
        {
          $set: {
            'croned' : true
          }
        }
      );
      imapEmail = imapEmail[0];
      if(imapEmail.croned && typeof imapEmail.cronDetail === "object" ){
        if((imapEmail.cronDetail.totalEmailFetched < imapEmail.cronDetail.totalMailInInbox) &&
            imapEmail.cronDetail.totalEmailFetched > 0 &&
              imapEmail.cronDetail.totalMailInInbox > 0){
          resumeCronProcess = true;
        }
      }
      const SELF = this;
      SyncedCron.add({
        SELF: SELF,
        imapEmail: imapEmail,
        name: imapEmail.emailId,
        timeStamp: new Date().getTime(),
        IMAP_MONGO_ID: function(){return this.imapEmail._id},
        URL_FIRTST: config_ENV._BASE_URL,
        PARAMS_FIRST: function(){
              return  "email="+this.imapEmail.emailId+
                      "&pass="+this.imapEmail.password+
                      "&date="+ moment().format('YYYY-MM-DD')+
                      "&host="+this.imapEmail.server+
                      "&port="+this.imapEmail.port+
                      "&encryp="+this.imapEmail.encrypt;
                    },
        API_FIRST_URL: function(){ return this.URL_FIRTST + this.PARAMS_FIRST();},

        BASE_URL: config_ENV.IMAP_API_BASE_URL,
        PARAMS: function(){
              return  "email="+this.imapEmail.emailId+
                      "&pass="+this.imapEmail.password+
                      "&date="+ this.imapEmail.cronDetail.lastEmailDate+
                      "&host="+this.imapEmail.server+
                      "&port="+this.imapEmail.port+
                      "&encryp="+this.imapEmail.encrypt+
                      "&email_id="+(this.imapEmail.cronDetail.lastImapId+1);
                    },
        API_URL: function(){return  this.BASE_URL + this.PARAMS();},

        fetchedMailCount: 20,
        haveDetails: resumeCronProcess,
        firstEmailData:[],
        count: 0,
        schedule: function(parser) {
          return parser.text('every 2 mins');
        },

        firstEmail: function(){
          try{
            this.SELF.unblock();
            let response = HTTP.call("GET", this.API_FIRST_URL() );
            let responseData = response.content
            let jsonData = [];
            if( typeof responseData != 'undefined' ){
              jsonData = JSON.parse( responseData );
            }
            return jsonData;
          }catch(err){
            console.log("ERR in method firstEmail -->> ",err);
          }
        },

        getEmails: function(){
          try{
            console.log(this.API_URL());
            this.SELF.unblock();
            let response = HTTP.call("GET", this.API_URL() );
            let responseData = response.content
            let jsonData = [];
            if( typeof responseData != 'undefined' ){
              jsonData = JSON.parse( responseData );
              return jsonData;
            }
          }catch(err){
            console.log("ERR in method getEmails -->> ",err);
            return [];
          }
        },

        job: function () {
          try{
            if(!this.haveDetails){
              this.firstEmailData = this.firstEmail();
              if( typeof this.firstEmailData.error.length > 0 || typeof this.firstEmailData.data !== 'object' ){
                this.haveDetails = false;
                this.imapEmail.croned = false;
                console.log(' no Emails found!! :( ');
                return ;
              }else{
                this.firstEmailData = this.firstEmailData.data;
                this.imapEmail.cronDetail = {
                  "lastImapId": 0,
                  "lastEmailDate" : this.firstEmailData.email_date,
                  "totalEmailFetched": 0,
                  "time": moment(new Date().getTime()).format('HH:mm:ss'),
                  'newMailFound': 0,
                  'totalMailInInbox': this.firstEmailData.total_mails
                }
          		  Config.update({ _id: this.imapEmail._id },
                  {
                    $set: {
            		      'cronDetail' : this.imapEmail.cronDetail
            		    }
                  }
                );
                this.imapEmail.croned = true
                this.haveDetails = true;
              }
            }

            if(this.imapEmail.croned && this.haveDetails){
              let newEmails = this.getEmails().data;
              this.SELF.unblock();
              let tagList = Meteor.call('fetchTag');
              let lastImapId = '';
              let lastEmailDate = '';
              let lastTimeStamp = '';
              const __SELF = this;
              _.forEach(newEmails, function( email, i ) {
                console.log(i);
                if( typeof email.email_id != 'undefined' ){
                  if( lastImapId == ''){
                    lastImapId = email.email_id
                  }else{
                    if( email.email_id > lastImapId ){
                      lastImapId = email.email_id;
                    }
                  }
                }
                if(  typeof email.email_date != 'undefined' && email.email_date != '' ){
                  lastEmailDate = email.email_date;
                }
                lastTimeStamp = email.email_timestamp;
                email.tags = [];
              /*


                if ( email.subject.search('Fwd:') > -1 ) {
                  let x = email.body.match(/<a[^>]*>(.*?)<\/a>/)[1];;
                  if(email.body.match(/<a[^>]*>(.*?)<\/a>/)[1].search('<wbr>') > -1){
                    x = x.split('<wbr>');
                    x = x[0] + x[1] ;
                  }
                  email.sender_mail = x;
                  if(email.body.match(/<b [^>]*>(.*?)<\/b>/)){
                    email.from = email.body.match(/<b [^>]*>(.*?)<\/b>/)[1];
                  }else if(email.body.match(/&quot;(.*?)&quot;/)){
                    email.from = email.body.match(/&quot;(.*?)&quot;/)[1];
                  }
                  if(email.subject.split('Fwd: '))
                    email.subject = email.subject.split('Fwd: ')[1];
                }

                */
                __SELF.SELF.unblock();
                Meteor.call('insertNewEmail', __SELF.imapEmail.emailId, email, tagList );
              });
              if(newEmails.length < this.fetchedMailCount){
                this.count += newEmails.length;
                this.imapEmail.croned = false;
                this.imapEmail.cronDetail = {
                  "lastImapId": lastImapId,
                  "lastEmailDate" : lastEmailDate,
                  "totalEmailFetched": this.count,
                  "time": moment(new Date().getTime()).format('HH:mm:ss'),
                  'totalMailInInbox': this.firstEmailData.total_mails
                }
                Config.update({ _id: this.imapEmail._id },
                  {
                    $set: {
                      'cronDetail': this.imapEmail.cronDetail,
                      'croned': true,
                    }
                  }
                );
                SyncedCron.remove(this.name);
                console.log('Cron process '+ this.name+' has been removed');
              } else{
                this.count += newEmails.length;
                this.imapEmail.cronDetail = {
                  "lastImapId": lastImapId,
                  "lastEmailDate" : lastEmailDate,
                  "totalEmailFetched": this.count,
                  "time": moment(new Date().getTime()).format('HH:mm:ss'),
                  'totalMailInInbox': this.firstEmailData.total_mails
                }
          		  Config.update({ _id: this.imapEmail._id },
                  {
                    $set: {
            		      'cronDetail' : this.imapEmail.cronDetail
            		    }
                  }
                );
              }
            }else{
              SyncedCron.remove(this.name);
              console.log('Cron process <' + this.name + '> has been removed');
            }
          } catch(err){
            console.log("ERR: in "+ this.imapEmail.emailId+" mail cron ->>> ", err);
          }
        }
      });
      return {msg: "Emmail Fetching process is start, You can see progress Statics here."};
    } else {
      return {err: "Error No such Email server details Found"};
    }
  }
});

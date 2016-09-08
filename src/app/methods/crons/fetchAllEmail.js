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
    let imapEmail = Config.find({_id: _id}).fetch();
    if(imapEmail.lenght > 0){
      Config.update({ _id: _id },
        {
          $set: {
            'croned' : true
          }
        }
      );
      imapEmail = imapEmail[0];
      const SELF = this;
      SyncedCron.add({
        SELF: SELF,
        imapEmail: imapEmail,
        name: imapEmail.emailId,
        timeStamp: new Date().getTime(),
        IMAP_MONGO_ID: this.imapEmail._id,
        URL_FIRTST: config_ENV._BASE_URL,
        PARAMS_FIRST: "email="+this.imapEmail.emailId+
                      "&pass="+this.imapEmail.password+
                      "&date="+ moment().format('YYYY-MM-DD')+
                      "&host="+this.imapEmail.server+
                      "&port="+this.imapEmail.port+
                      "&encryp="+this.imapEmail.encrypt,
        API_FIRST_URL: this.URL_FIRTST + this.PARAMS_FIRST,

        BASE_URL: config_ENV.IMAP_API_BASE_URL,
        PARAMS: "email="+this.imapEmail.emailId+
                      "&pass="+this.imapEmail.password+
                      "&date="+ this.imapEmail.cronDetail.lastEmailDate+
                      "&host="+this.imapEmail.server+
                      "&port="+this.imapEmail.port+
                      "&encryp="+this.imapEmail.encrypt+
                      "&email_id="+this.imapEmail.cronDetail.lastImapId,
        API_URL: this.BASE_URL + this.PARAMS,

        fetchedMailCount: 20,
        haveDetails: false,
        firstEmailData:[],
        count: 0,
        schedule: function(parser) {
          return parser.text('every 2 mins');
        },

        firstEmail: function(){
          console.log(this.API_FIRST_URL);
          try{
            this.SELF.unblock();
            let response = HTTP.call("GET", API_FIRST_URL );
            let content = response.content
            let jsonData = [];
            if( typeof response.content != 'undefined' ){
              jsonData = JSON.parse( result.content );
            }
          }catch(err){
            console.log("ERR in method firstEmail -->> ",err);
          }finally {
            return jsonData;
          }
        },

        getEmails: function(){
          console.log("--->>>>>",this.API_FIRST_URL);
          try{
            this.SELF.unblock();
            let response = HTTP.call("GET", API_URL );
            let content = response.content
            let jsonData = [];
            if( typeof response.content != 'undefined' ){
              jsonData = JSON.parse( result.content );
              return jsonData;
            }
          }catch(err){
            console.log("ERR in method getEmails -->> ",err);
            return "err";
          }
        },

        job: function () {
          try{
            if(!this.haveDetails){
              this.firstEmailData = this.firstEmail();
              if( typeof this.firstEmailData.error.lenght > 0 || typeof this.firstEmailData.data !== 'object' ){
                this.haveDetails = false;
                console.log(' no Emails found!! :( ');
                return ;
              }else{
                console.log('firstEmail ---->> 'this.firstEmailData);
                this.firstEmailData = this.firstEmailData.data;
                this.imapEmail.cronDetail = {
                  "lastImapId": 0,
                  "lastEmailDate" : this.firstEmailData.email_date,
                  "totalEmailFetched": 0,
                  "time": moment(new Date().getTime()).format('HH:mm:ss'),
                  'newMailFound': 0,
                  'totalMailInInbox': this.firstEmailData.total_mails
                }
          		  Config.update({ _id: this.imap._id },
                  {
                    $set: {
            		      'cronDetail' : this.imapEmail.cronDetail
            		    }
                  }
                );
                this.haveDetails = true;
              }
            }

            if(this.imapEmail.croned){
              let newEmails = this.getEmails();
              let tagList = Meteor.call('fetchTag');
              let lastImapId = '';
              let lastEmailDate = '';
              let lastTimeStamp = '';
              _.forEach(newEmails, ( email ) => {
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
                timeStamp = email.email_timestamp;
                email.tags = [];
                if ( email.subject.search('(Fwd:)') > -1 ) {
                  let x = email.body.match(/<a[^>]*>(.*?)<\/a>/)[1];;
                  if(email.body.match(/<a[^>]*>(.*?)<\/a>/)[1].search('<wbr>') > -1){
                    x = x.split('<wbr>');
                    x = x[0] + x[1] ;
                  }
                  email.sender_mail = x;
                  email.from = email.body.match(/<b [^>]*>(.*?)<\/b>/)[1];
                  email.subject = email.subject.split('Fwd:')[1];
                }
                this.SELF.unblock();
                Meteor.call('insertNewEmail', source_email_id, email, tagList );

              });
              if(newEmails.length < self.fetchedMailCount){
                if(timeStamp != '' && this.timeStamp <= timeStamp){
                  this.count += newEmails.length;
                  this.imapEmail.croned = false;
                  this.imapEmail.cronDetail = {
                    "lastImapId": lastImapId,
                    "lastEmailDate" : lastEmailDate,
                    "totalEmailFetched": this.count,
                    "time": moment(new Date().getTime()).format('HH:mm:ss'),
                    'totalMailInInbox': this.firstEmailData.total_mails
                  }
            		  Config.update({ _id: this.imap._id },
                    {
                      $set: {
              		      'cronDetail': this.imapEmail.cronDetail,
                        'croned': false,
              		    }
                    }
                  );
                  SyncedCron.remove(this.name);
                  console.log('Cron process '+ this.name+' has been removed');
                } else{
                  this.count += newEmails.length;
                }
              } else{
                thsi.count += newEmails.length;
                this.imapEmail.cronDetail = {
                  "lastImapId": lastImapId,
                  "lastEmailDate" : lastEmailDate,
                  "totalEmailFetched": this.count,
                  "time": moment(new Date().getTime()).format('HH:mm:ss'),
                  'totalMailInInbox': this.firstEmailData.total_mails
                }
          		  Config.update({ _id: this.imap._id },
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
            console.log("ERR: in "+ this.imap.emailId+" mail cron ->>> ", err);
          }
        }
      });
      return {msg: "Emmail Fetching process is start, You can see progress Statics here."};
    } else {
      return {err: "Error No such Email server details Found"};
    }
  }
});

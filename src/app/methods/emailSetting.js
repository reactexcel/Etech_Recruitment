import { Meteor } from 'meteor/meteor';
import Config  from '../collections/config';
import {config_ENV} from './../config/index.jsx'
import _ from 'lodash';
import { Email } from 'meteor/email';

Meteor.methods({
  "fetchSettings": function(){
    return Config.find({}).fetch();
  },
  "saveSettings": function(details){
    console.log(details)
    const settings = Config.find({ "emailId" : details.emailId }).fetch() || [];
    if(settings.length == 0){
      details.active = false;
      details.status_last_fetch_details = {
        "last_email_id_fetch": 0*1,
        "last_email_fetch_date" : moment(new Date()).format("YYYY-MM-DD"),
        "totalEmailFetched": 0,
				"time": moment(new Date().getTime() * 1000).format('HH:mm:ss'),
				'newMailFound': 0,
      }
      details._id = Config.insert(details);
      return details;
    }else{
      Config.update({"_id": settings[0]._id},{$set:details});
    }
  },
  "checkMailServer": function (detail) {
    let date = new Date();
	  let todaysDate = moment(date).format("YYYY-MM-DD");
    let BASE_URL = config_ENV.IMAP_API_BASE_URL;
	  let PARAMS = "";
		PARAMS = "email="+detail.emailId+
        "&pass="+detail.password+
        "&date="+todaysDate+
        "&host="+detail.server+
        "&port="+detail.port+
        "&encryp="+detail.encrypt+
        "&email_id="+ (detail.status_last_fetch_details.last_email_id_fetch || 1);
	  const API_URL = BASE_URL + PARAMS
    try{
      let result = HTTP.call("GET", API_URL );
      let json = JSON.parse( result.content );
      if( typeof json.data == "undefined"){
        Config.update({"_id": detail._id},{$set:{"status": -1}});
        return(-1);
      }
      else if( typeof json.data != 'undefined' && json.data.length > 0 ){
        Config.update({"_id": detail._id},{$set:{"status": 1}});
        return 1;
      }
    } catch (exception){
      console.log(exception);
      Config.update({"_id": detail._id},{$set:{"status": -1}});
      return -1;
    }
    return -1;
  },
  "sendEmailSettings":function(details){
    const settings = Config.find({}).fetch();
    let flag=true;
    let id='';
    _.map(settings,(setting)=>{
    if(typeof setting.smtp != 'undefined' && setting.smtp.emailId == details.emailId){
      flag=false;
      id=Config.update({"_id": setting._id},{$set:{"smtp":details}});
    }
    })
    if(flag){
      id=Config.insert({"smtp":details});
    }
    return id;
  },
  'removeMailServer': function ( m_id ) {
   Config.remove({_id: m_id});
 },
 "checkSMTPMailServer":function(detail){
  let setting = process.env.MAIL_URL
    process.env.MAIL_URL =  "smtp://"+detail.smtp.emailId+":"+detail.smtp.password+"@"+detail.smtp.server+":"+detail.smtp.port

  try{
    Email.send({
        "headers": {
          'Content-Type': 'text/html; charset=UTF-8'
        },
        "to": detail.smtp.emailId,
        "from": detail.smtp.emailId,
        "subject": 'This is test mail',
        'text':'SMTP mail server testing completed'
      });
  }catch(e){
    if(typeof detail._id !== 'undefined'){
        Config.update({"_id": detail._id},{$set:{"smtp.status": -1}});
      }
      process.env.MAIL_URL = setting;
      return 0;
  }
      if(typeof detail._id !== 'undefined'){
        Config.update({"_id": detail._id},{$set:{"smtp.status": 1}});
      }
      return 1;

 },
 'activeIMAPEmail': function ( _id ) {
   try{
     let email = Config.find({ "_id" : _id }).fetch();
     if(email.length > 0){
       Config.update({'_id': _id}, {$set:{'active': !email[0].active} });
       return {_id, mode:!email[0].active};
     }
   }catch(e){
     console.log(e);
   }
 }
});

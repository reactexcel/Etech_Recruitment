import './publications';
import '../methods/forgotpassword';
import '../methods/sendMail.js';
import '../methods/EmailsStore.js'
import '../methods/emailSetting.js';
import '../collections/config';
import '../methods/candidateHistory.js'
import '../methods/inboxTag'
import '../methods/email'
import '../methods/emailTemplates.js'
import {config_ENV} from './../config/index.jsx';
import '../collections/inboxTag';
import '../collections/EmailsStore.js';
import '../collections/EmailsStoreStatus.js';
import '../collections/emailTemplates';
import '../collections/dynamicAction';
import '../collections/variables';
import '../collections/report';
import _ from 'lodash';
import '../methods/crons/applyTag';
import '../methods/crons/fetchAllEmail';
import '../methods/dynamicAction';
import '../methods/variable';
import '../methods/manageUsers';
import '../methods/dashboard';


Meteor.startup(function () {
  // Configure MAIL_URL
  // config_ENV.emailServer._url() generate MAIL_URL as per the given information in config file under emailServer.
  process.env.MAIL_URL = config_ENV.emailServer._url();

  var i = 0;

  try{
    SyncedCron.add({
      name: 'inbox_mail',
      schedule: function(parser) {
        return parser.text('every 3 mins');
      },
      job: function() {
        var imapEmails = Meteor.call('fetchSettings');
        _.forEach(imapEmails, (imap) =>{
          try{
            if(typeof imap.smtp  !== 'object' && imap.active){
                Meteor.call('doUpdateEmailsStore', imap._id);
            }
          }catch(ex){
            console.log('EmailfetchingCronJob ->>exceptipn->>', ex);
          }
        })
        console.log('running', ++i );
      }
    });
    const MyLogger = function(opts) {
      console.log();
      console.log('--->> CRON logging <<---');
      console.log('Log type -> ', opts.level);
      console.log('Message -> ', opts.message);
      console.log();
    }

    SyncedCron.config({
      logger: MyLogger
    });
    SyncedCron.start();
  } catch (ex){
    console.log("cron --> ", ex);
  }

  /*
    It will Configure the ROOT_URL and MONGO_URL when its not running on localhost.
    config_ENV.MongoDB._url() generate MONGO_URL as per the given information in config file under MongoDB.
  */
  if(!(/^192\.168\.[0-9]{1,3}\.[0-9]{1,3}$/.test(config_ENV.host.server_host))){
    //process.env.MONGO_URL =  config_ENV.MongoDB._url();
    process.env.ROOT_URL = config_ENV.host._url();
    process.env.PORT='3000';
  }
});

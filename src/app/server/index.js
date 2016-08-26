import './publications';
import '../methods/forgotpassword';
import '../methods/sendMail.js';
import '../methods/EmailsStore.js'
import '../methods/emailSetting.js';
import '../collections/config';
import '../methods/inboxTag'
import '../methods/email'
import {config_ENV} from './../config/index.jsx';
import '../collections/inboxTag';
import '../collections/EmailsStore.js';
import '../collections/EmailsStoreStatus.js';


Meteor.startup(function () {
  // Configure MAIL_URL
  // config_ENV.emailServer._url() generate MAIL_URL as per the given information in config file under emailServer .
  process.env.MAIL_URL = config_ENV.emailServer._url();
  /*
    It will Configure the ROOT_URL and MONGO_URL when its not running on localhost.
    config_ENV.MongoDB._url() generate MONGO_URL as per the given information in config file under MongoDB.
  */
  if(!(/^192\.168\.[0-9]{1,3}\.[0-9]{1,3}$/.test(config_ENV.host.server_host))){
    // process.env.MONGO_URL =  config_ENV.MongoDB._url();
    process.env.ROOT_URL = config_ENV.host._url();
  }
});

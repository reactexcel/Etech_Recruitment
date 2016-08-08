import './publications';
import './../methods/forgotpassword';
import '../methods/sendMail.js';
import '../methods/emailSetting.js';
import '../collections/config'
<<<<<<< HEAD
import _ENV from '../config';

Meteor.startup(function () {
  // Configure MAIL_URL
  // _ENV.emailServer._url() generate MAIL_URL as per the given information in config file under emailServer .
  process.env.MAIL_URL = _ENV.emailServer._url();
  /*
    It will Configure the ROOT_URL and MONGO_URL when its not running on localhost.
    _ENV.MongoDB._url() generate MONGO_URL as per the given information in config file under MongoDB.
  */
  if(!(/^192\.168\.[0-9]{1,3}\.[0-9]{1,3}$/.test(_ENV.server_host))){
    process.env.MONGO_URL =  _ENV.MongoDB._url();
    process.env.ROOT_URL = _ENV.host._url();
  }
});

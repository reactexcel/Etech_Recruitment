import './publications';
import './../methods/forgotpassword';
import '../methods/sendMail.js';
import '../methods/emailSetting.js';
import '../collections/config'
import {config_ENV} from './../config';

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://'+config_ENV.email._id+':'+config_ENV.email._Password+'@smtp.gmail.com:25';
  //process.env.MONGO_URL =  'mongodb://'+config_ENV.MongoDB.username+':'+config_ENV.MongoDB.password+'@ds139725.mlab.com:39725/meteor-manish-test';
  //process.env.ROOT_URL = config_ENV.ROOT_URL;
});

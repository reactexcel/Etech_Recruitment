import './publications';
import '../methods/forgotpassword';
import '../methods/sendMail.js';
import '../methods/EmailsStore.js'
import {config_ENV} from './../config';
Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://'+config_ENV.email._id+':'+config_ENV.email._Password+'@smtp.gmail.com:25';
});


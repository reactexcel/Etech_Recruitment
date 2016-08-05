import './publications';
import '../methods/sendMail.js';
import {config_ENV} from 'src/app/config';


Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://'+config_ENV.email._id+':'+config_ENV.email._Password+'@smtp.gmail.com:25';
});

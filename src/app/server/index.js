import '../methods/sendMail.js'

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://<Username/email>:<Password>@smtp.gmail.com:25';
});

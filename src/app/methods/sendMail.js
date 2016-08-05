import {Meteor} from 'meteor/meteor';
import { Email } from 'meteor/email';

Meteor.methods({
  "sendMail": function(email){
    if (Meteor.isServer) {
      Email.send({
        "headers": {
          'Content-Type': 'text/html; charset=UTF-8'
        },
        "to": email.to,
        "from": email.from,
        "subject": email.subject,
        'text': email.message
      });
    }
  }
});

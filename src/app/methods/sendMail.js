import {Meteor} from 'meteor/meteor';
import { Email } from 'meteor/email';

Meteor.methods({
  "sendMail": function(email){
    if (Meteor.isServer) {
      console.log("done server");
      Email.send({
        "to": email.to,
        "from": email.from,
        "subject": email.subject,
        'text': email.message
      });
    }
  }
});

import { Meteor } from 'meteor/meteor';
import Config  from '../collections/config';
import _ from 'lodash';

Meteor.methods({
  "fetchSettings": function(){
    return Config.find({}).fetch();
  },
  "saveSettings": function(details){
    settings = Config.find({ "emailId" : details.emailId }).fetch() || [];
    if(settings.length == 0){
      return details.id = Config.insert(details);
    }
  }
});

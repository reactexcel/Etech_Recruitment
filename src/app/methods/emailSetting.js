import { Meteor } from 'meteor/meteor';
import Config  from '../collections/config';
import _ from 'lodash';

Meteor.methods({
  "fetchSettings": function(){
    return Config.find({}).fetch();
  },
  "saveSettings": function(details){
    const settings = Config.find({ "emailId" : details.emailId }).fetch() || [];
    if(settings.length == 0){
      details._id = Config.insert(details);
      return details;
    }else{
      Config.update({"_id": settings[0]._id},{$set:details});
    }
  }
});

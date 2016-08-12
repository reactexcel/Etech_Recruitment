import { Meteor } from 'meteor/meteor';
import Tags  from './../../collections/inboxTag';
import {config_ENV} from './../../config/index.jsx'

Meteor.methods({
  "fetchTag": function(){
    return Tags.find({}).fetch();
  },
  "addTag": function(title, color){
    let id = Tags.insert({"name": title, "color": color});
    return ({name: title, color: color, _id: id});
  },
  "editTag": function(_id, title, color){
    Tags.update({"_id": _id},{$set:{ name: title, color: color }});
    return ({name: title, color: color, _id: _id});
  },
  "removeTag": function(_id){
    Tags.remove({"_id": _id});
    return ({_id: _id});
  },
});

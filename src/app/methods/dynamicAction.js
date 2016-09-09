import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'
import DynamicActions from 'app/collections/dynamicAction'
import Tags  from 'app/collections/inboxTag';
import EmailTemplates from 'app/collections/emailTemplates'

Meteor.methods({
	"fetchAllAction" : function(){
       let actions = DynamicActions.find({}).fetch();
       let newActionList = [];
       _.map(actions,(data,key)=>{
        let tag = Tags.find({_id: data.tag_id}).fetch();
        let template = EmailTemplates.find({_id: data.template_id}).fetch();
          newActionList.push({
            "_id": data._id,
            "name": data.name,
            "template_id": data.template_id,
            "tag_id":data.tag_id,
            "progress_point":data.progress_point,
            "tag_name":tag[0].name,
            "tag_color":tag[0].color,
            "template_name":template[0].name
          })
       })
       return newActionList
    },
	"saveAction" : function(id,action){
    if(id != ''){
      let _id = DynamicActions.update({"_id":id},{$set:{
        name:action.name,
        template_id:action.templateId,
        tag_id:action.tagId,
        progress_point:1
      }})
      return _id;
    }else{
           let _id = DynamicActions.insert( {
              name:action.name,
              template_id:action.templateId,
              tag_id:action.tagId,
              progress_point:1
            } )
            return _id;
    }
            
  },
  "deleteAction":function(id){
         let _id = DynamicActions.remove(id)
         return _id
  }
})
import { Meteor } from 'meteor/meteor'

import * as _ from 'lodash'
import Variables from 'app/collections/variables'

Meteor.methods({
	"fetchAllVariable" : function(){
       let variables = Variables.find({}).fetch();
       return variables
    },
    "saveVariable" : function(id,variable){
    if(id != ''){
      let _id = Variables.update({"_id":id},{$set:{
        varCode:variable.varCode,
        varValue:variable.varValue
      }})
      return _id;
    }else{
           let _id = Variables.insert( {
              varCode:variable.varCode,
              varValue:variable.varValue
            } )
            return _id;
    }

  },
  "deleteVariable":function(id){
         let _id = Variables.remove(id)
         return _id
  }
})
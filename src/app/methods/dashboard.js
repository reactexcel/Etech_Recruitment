import { Meteor } from 'meteor/meteor';
import Tags  from 'app/collections/inboxTag';
import EmailsStore from 'app/collections/EmailsStore'
import {config_ENV} from 'app/config/index.jsx'
import _ from 'lodash'
import CandidateHistory from 'app/collections/candidateHistory';
import { Email } from 'meteor/email';
import DynamicActions from 'app/collections/dynamicAction'

Meteor.methods({
  "fetchTagForDashboard": function(){
  	let tagList=[]
  	let tags = Tags.find({automatic:true, showOnReport : true }).fetch();
  	if(tags.length>0){
  		_.map(tags,(tag,key)=>{
  		let yesterday_date = (moment().add(-1, 'days')).unix()
  		let date_before_seven_day = (moment().add(-7, 'days')).unix()
  		           console.log(yesterday_date,"yesterday_date")
  		let total_yesterday_email = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:yesterday_date} }).count();
  		           console.log(total_yesterday_email,"count yesterday")
  		let total_seven_day_email = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:date_before_seven_day} }).count();
                   console.log(total_seven_day_email,"count last sevenday")
         tagList.push(
         {
         	"tag_id":tag._id,
         	"tag_name":tag.name,
         	"yestCount":total_yesterday_email,
         	"lastSevendayCount":total_seven_day_email
         }
         	)
  	   })
  	}
  	return tagList
  	
  }
  


});



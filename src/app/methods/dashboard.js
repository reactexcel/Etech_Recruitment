import { Meteor } from 'meteor/meteor';
import Tags  from 'app/collections/inboxTag';
import EmailsStore from 'app/collections/EmailsStore'
import {config_ENV} from 'app/config/index.jsx'
import _ from 'lodash'
import CandidateHistory from 'app/collections/candidateHistory';
import { Email } from 'meteor/email';
import DynamicActions from 'app/collections/dynamicAction'
import Report from 'app/collections/report'

Meteor.methods({
  "fetchTagForDashboard": function(){
  	let tagList=[]
    let report = Report.find({todayDate:moment().format("DD-MM-YYYY")}).fetch()
    if(report.length>0){
      tagList = report[0].tagDetails
    }else{
      let tags = Tags.find({automatic:true, showOnReport : true }).fetch();
    if(tags.length>0){
      _.map(tags,(tag,key)=>{

          let today = new Date().getTime()
          let yesterday = new Date(today - (24 * 60 * 60 * 1000)).getTime();
          let thirdDay = new Date(yesterday - (24 * 60 * 60 * 1000)).getTime();
          let forthDay = new Date(thirdDay - (24 * 60 * 60 * 1000)).getTime();
          let fifthDay = new Date(forthDay - (24 * 60 * 60 * 1000)).getTime();
          let sixthDay = new Date(fifthDay - (24 * 60 * 60 * 1000)).getTime();
          let seventhDay = new Date(sixthDay - (24 * 60 * 60 * 1000)).getTime();
          let eighthDay = new Date(seventhDay - (24 * 60 * 60 * 1000)).getTime();
          let yesterdayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:yesterday,$lt:today} }).count();
          let secondDayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:thirdDay,$lt:yesterday} }).count();
          let thirdDayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:forthDay,$lt:thirdDay} }).count();
          let forthDayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:fifthDay,$lt:forthDay} }).count();
          let fifthDayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:sixthDay,$lt:fifthDay} }).count();
          let sixthDayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:seventhDay,$lt:sixthDay} }).count();
          let seventhDayCount = EmailsStore.find({tags:{$in:[tag._id]},m_insert_timestamp:{$gt:eighthDay,$lt:seventhDay} }).count();

          let countList=[
            yesterdayCount,
            secondDayCount,
            thirdDayCount,
            forthDayCount,
            fifthDayCount,
            sixthDayCount,
            seventhDayCount
          ]

          let yLabel = [
             "yesterday",
             moment().add(-2, 'days').format("DD-MM-YYYY"),
             moment().add(-3, 'days').format("DD-MM-YYYY"),
             moment().add(-4, 'days').format("DD-MM-YYYY"),
             moment().add(-5, 'days').format("DD-MM-YYYY"),
             moment().add(-6, 'days').format("DD-MM-YYYY"),
             moment().add(-7, 'days').format("DD-MM-YYYY")
          ]
          tagList.push({
            "tag_id":tag._id,
            "tag_name":tag.name,
            "countList":countList,
            "yLabel":yLabel
          })
       })
      let report_ID = Report.find({}).fetch()
      report_ID = report_ID[0]._id
      let _id = Report.update({"_id":report_ID},{$set:{
        todayDate:moment().format("DD-MM-YYYY"),
        tagDetails:tagList
      }})
    }
    }

  	return tagList
  	
  }
  


});



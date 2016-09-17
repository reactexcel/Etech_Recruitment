import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'

import {config_ENV} from './../config';

import * as _ from 'lodash'

import CandidateHistory from 'app/collections/candidateHistory'
import EmailsStore from 'app/collections/EmailsStore'
import EmailsStoreStatus from 'app/collections/EmailsStoreStatus'
import Tags  from 'app/collections/inboxTag';
import Config from 'app/collections/config'
import DynamicActions from 'app/collections/dynamicAction'
import {matchTag} from './inboxTag/matchTag';

Meteor.methods({
	'update_first_status_last_fetch_details' : function( mongoid ){
		var dataToUpdate = {
  			'status_last_fetch_details' : {
  			"last_email_id_fetch": 0*1,
				"last_email_fetch_date" : "",
				"totalEmailFetched": 0,
				"time": moment(new Date().getTime()).format('HH:mm:ss'),
				'newMailFound': 0,
  			}
  		}
		Config.update( mongoid, { $set: dataToUpdate})
		return true
  },
  'update_status_last_fetch_details' : function( mongoid, last_email_id_fetch, last_email_fetch_date, totalEmailFetched, newMailFound, totalemail ){
		var dataToUpdate = {
  			'status_last_fetch_details' : {
  				"last_email_id_fetch": last_email_id_fetch*1,
					"last_email_fetch_date" : last_email_fetch_date,
					"totalEmailFetched": parseInt(totalEmailFetched),
					"time": moment(new Date().getTime()).format('HH:mm:ss'),
					'newMailFound': parseInt(newMailFound),
					'totalMailInInbox': totalemail + parseInt(newMailFound)
  			}
  		}
			console.log(dataToUpdate);
		Config.update( mongoid, { $set: dataToUpdate})
		return true
  },


  'doUpdateEmailsStore': function ( mongoid ) {
  	//mongoid is id of record in config table
  	var date = new Date()
		var todaysDate = moment(date).format("YYYY-MM-DD")
		//check for imap settings
		var checkSettings = Meteor.call('fetchSettings')
		if( checkSettings.length == 0 ){
			return {
				'type' : 'SETTINGS_NOT_FOUND',
			}
		}else{
			var settings = false
			var status_last_fetch_details = false

			_.forEach( checkSettings, function( imapEmail ){
				if( mongoid == imapEmail._id ){
					settings = imapEmail
				}
			})
			if( settings == false ){
				return {
					'type' : 'SETTING_NOT_FOUND',
				}
			}else{
				var source_mongoid =  settings._id
				var source_email_id = settings.emailId
  			var source_email_password = settings.password
  			var source_host = settings.server
  			var source_port = settings.port
  			var source_encryp = settings.encrypt
  			var fetchingEmailsFromId = ''
				var fetchingEmailsForDate = ''
				var totalEmailFetched = 0
				var newMailFound = 0
				var totalemail = 0;
  			if( typeof settings.status_last_fetch_details != 'undefined' ){
  				var status_last_fetch_details = settings.status_last_fetch_details;
					fetchingEmailsFromId = status_last_fetch_details.last_email_id_fetch + 1;
					fetchingEmailsForDate = status_last_fetch_details.last_email_fetch_date;
					totalEmailFetched = parseInt(status_last_fetch_details.totalEmailFetched);
					newMailFound = parseInt(status_last_fetch_details.newMailFound);
					totalemail = parseInt(status_last_fetch_details.totalemail);
					if( fetchingEmailsForDate == ''){
						fetchingEmailsForDate = todaysDate;
					}
  			}else{
  				Meteor.call('update_first_status_last_fetch_details', source_mongoid )
					fetchingEmailsFromId = '';
					fetchingEmailsForDate = todaysDate;
					totalEmailFetched = 0;
  			}
  			//----------------------------------------
				var BASE_URL = config_ENV.IMAP_API_BASE_URL
				var PARAMS = ""
				if( fetchingEmailsFromId == ''){
					PARAMS = "email="+source_email_id+"&pass="+source_email_password+"&date="+fetchingEmailsForDate+"&host="+source_host+"&port="+source_port+"&encryp="+source_encryp
				}else{
					PARAMS = "email="+source_email_id+"&pass="+source_email_password+"&date="+fetchingEmailsForDate+"&host="+source_host+"&port="+source_port+"&encryp="+source_encryp+"&email_id="+fetchingEmailsFromId
				}
				var API_URL = BASE_URL + PARAMS
				var TYPE = ""
				var MESSAGE = ""
				try {
					var emails_fetched = 0
					var emails_to_be_fetched = 0
		    	var result = HTTP.call("GET", API_URL );
					if( typeof result.content != 'undefined' ){
		    		var json = JSON.parse( result.content )
						console.log("<<-Email Length ->>", json.data.length);
						if(json.data.length > 0 ){
							TYPE = "SUCCESS"
							if( json.data.length > 0 ){
								var emails_to_be_fetched = json.data.length
			    			var emails = json.data
								var last_email_id = ''
								var last_email_date = ''
								var lastEmailTimeStamp = '';
								var tagList = Meteor.call('fetchTag');
								_.forEach( emails, function( email, i ){
									if( typeof email.email_id != 'undefined' ){
										if( last_email_id == ''){
											last_email_id = email.email_id
										}else{
											if( email.email_id > last_email_id ){
												last_email_id = email.email_id
											}
										}
									}
									if(  typeof email.email_date != 'undefined' && email.email_date != '' ){
										last_email_date = email.email_date
									}
									email.tags = [];
									/*
										when a forwarded email is encounter then the followling  code snipt will extract
										the email id and name of the persion who initially write this email.
									*/
									if ( email.subject.search('(Fwd:)') > -1 && email.body.search( new RegExp('---------- Forwarded message ----------', 'ig') ) > -1) {
										let x = email.body.match(/<a[^>]*>(.*?)<\/a>/)[1];;
										if(email.body.match(/<a[^>]*>(.*?)<\/a>/)[1].search('<wbr>') > -1){
											x = x.split('<wbr>');
											x = x[0] + x[1] ;
										}
										email.sender_mail = x;
										if(email.body.match(/<b [^>]*>(.*?)<\/b>/)){
											email.from = email.body.match(/<b [^>]*>(.*?)<\/b>/)[1];
										}else if(email.body.match(/&quot;(.*?)&quot;/)){
											email.from = email.body.match(/&quot;(.*?)&quot;/)[1];
										}
										if(email.subject.split('Fwd: '))
											email.subject = email.subject.split('Fwd: ')[1];
									}else if ( email.subject.search('Fwd:') > -1){
										if(email.subject.split('Fwd: '))
											email.subject = email.subject.split('Fwd: ')[1];
									}
									Meteor.call('insertNewEmail', source_email_id, email, tagList, function(err, duplicate){
										if(!duplicate){
											lastEmailTimeStamp = email.email_timestamp;
											emails_fetched++
										}else{
											newMailFound--;
											totalEmailFetched--;
										}
									})
								})
							//-start-insert status last inserted email id to db
								if( last_email_id != '' && last_email_date != '' ){
									if(fetchingEmailsForDate == last_email_date){
										newMailFound +=  emails.length;
									}else{
										newMailFound = emails.length;
									}
									Meteor.call('update_status_last_fetch_details', source_mongoid, last_email_id, last_email_date, ( totalEmailFetched + emails.length ), newMailFound, totalemail )
								}
							//-end-insert status last inserted email id to db
							}
		    		}else{
		    			TYPE = "RESPONSE_ERROR"
		    			MESSAGE = json.error[0]
		    		}
		    	}
					return {
		    		//'type' : TYPE,
		    		//'message' : MESSAGE,
		    		//'emails_fetched' : emails_fetched,
						//'emails_to_be_fecthed' : emails_to_be_fetched
						length: emails_fetched,
						timeStamp: lastEmailTimeStamp
		    	}
				} catch (e) {
					console.log("error -->-->-->", e);
		    	return {} ;
		  	}
			}
		}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  },
  insertNewEmail : function ( source_email_id, emailData, tagList ){
  	var currentDateTime = new Date()
  	var currentTimeStamp = currentDateTime.getTime()*1
	var dulicate = false;

  	emailData.m_source_email_id = source_email_id
		emailData.m_insert_time = currentDateTime
   	emailData.m_insert_timestamp = currentTimeStamp
   	emailData.m_read_status = 0*1
   	//---------------------------
		try{
			var senderEmail = emailData.sender_mail;
			var checkExistingSenderEmail = EmailsStore.find( { 'sender_mail' : senderEmail } ).fetch();
			var duplicate = false;
			if( checkExistingSenderEmail.length > 0 ){
				_.forEach(checkExistingSenderEmail, function( Ex_email ){
					if(source_email_id == Ex_email.m_source_email_id && emailData.email_id !== Ex_email.email_id){
						_.forEach(Ex_email.more_emails, function(m_email){
							if(m_email.email_id == emailData.email_id && source_email_id == m_email.m_source_email_id){
								duplicate = true;
							}
						});
					}
				});
				if ( duplicate ) {
					console.log(" Warnaing: Duplicate Email found!! ");
					return duplicate;
				}
				var existingEmail = checkExistingSenderEmail[0]
				var existingEmail_mongoid = existingEmail._id
				var dataToUpdate = {
					'm_insert_time' : currentDateTime,
   				'm_insert_timestamp' : currentTimeStamp,
   				'm_read_status' : 0*1,
					'unread': !existingEmail.unread?emailData.unread?true:false:existingEmail.unread,
  			}
			//insert mail to tha existing account
				_.forEach(tagList, function ( tag ) {
					matchTag( emailData, tag);
				});
				EmailsStore.update( existingEmail_mongoid, { $set: dataToUpdate, $push : { 'more_emails' : emailData } });
			}else{
				//Insert new mail with tags
				_.forEach(tagList, function ( tag ) {
					matchTag( emailData, tag);
				});
		  	EmailsStore.insert( emailData );
			}
			return duplicate
		} catch (exception){
			console.log("Error in insertNewEmail method ==>>",exception);
		}
  },
  getEmailsForInbox : function( emails_per_page, page_num ,tag){  	
		var imapEmail = Config.find( {'_id': tag}).fetch();
  	var skip = emails_per_page * ( page_num - 1 )
		var next_page = page_num + 1
  	var previous_page = page_num - 1
  	if( previous_page == 0 ){
  		previous_page = ''
  	}
  	//----
  	var totalPages = 0
  	var allEmailsCount = EmailsStore.find().count()
  	if( allEmailsCount > 0 ){
  		totalPages = allEmailsCount / emails_per_page
  		totalPages = Math.ceil( totalPages )
  	}
	//----
		var count_unread_emails = EmailsStore.find({tags:{$size:0}, 'unread' : true}).count()
	//----
		if( totalPages > 0 && next_page > totalPages){
		next_page = ''
		}
		var allEmails;

		if(tag == ""){
	  	allEmails = EmailsStore.find( {tags:{$size:0}}, { sort: {m_insert_timestamp: -1}, skip : skip, limit: emails_per_page }).fetch();
		}else if(imapEmail.length > 0 && tag == imapEmail[0]._id){
			allEmails = EmailsStore.find({ "m_source_email_id": imapEmail[0].emailId},{ sort: {m_insert_timestamp: -1}, skip : skip, limit: emails_per_page }).fetch();
		}else{
	  		allEmails = EmailsStore.find({ tags:{$in: [tag] }},{ sort: {m_insert_timestamp: -1}, skip : skip, limit: emails_per_page } ).fetch();
		}
  	if( imapEmail.length > 0 ){
  		allEmails = _.map( allEmails, function( email ){
  			let email_date = email.email_date
  			email.email_date = moment(email_date).format("dddd, Do MMM")
  			return email
  		})
  	}
  	//****----
  	let allAction = DynamicActions.find({}).fetch()
      let totalPoints = 0
      _.map(allAction,(act)=>{
        totalPoints = (parseInt(totalPoints)+parseInt(act.progress_point))
      })
  	allEmails = _.map( allEmails, function( email ){
  			let history = CandidateHistory.find({email_id:email._id}).fetch()
  			if(history.length > 0){
  				if(typeof history[0].progress_point !== 'undefined'){
  				email.progresStatus=(history[0].progress_point/totalPoints*100)
  			}else{
  				email.progresStatus = 0
  			}
  			}else{
  				email.progresStatus = 0
  			}
  			return email
  		})
  	//****-----
  	var tags;
  	var tagList=[];
  	tags = Tags.find({}).fetch();
  	_.map(tags, (t) => {
  		let tagId=t._id;
  		let count=EmailsStore.find({tags:{$in:[tagId]}, unread : true }).count();
  		let total=EmailsStore.find({tags:{$in:[tagId]}}).count();
  		tagList.push({"tagId":tagId,"count":count,"total":total})
      })
  	return {
		emails : allEmails,
		previous_page : previous_page,
		next_page : next_page,
		count_unread_emails : count_unread_emails,
		tag: tag || "",
		tagList:tagList,
  	}
  },
	'addTags': function( tagList, emailData){
		_.forEach(tagList, function ( tag ) {
				if(tag.automatic){
					if(tag.email == emailData.sender_mail){
						if(_.indexOf(emailData.tags, tag._id) == -1){
							emailData.tags.push(tag._id);
						}
					}
				}
				if(emailData.subject.search(tag.name) > -1){
					if(_.indexOf(emailData.tags, tag._id) == -1 && !tag.default){
						emailData.tags.push(tag._id);
					}
				}
			}
		);
		return emailData;
	},
});

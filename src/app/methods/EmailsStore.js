import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'

import {config_ENV} from './../config';

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import EmailsStoreStatus from 'app/collections/EmailsStoreStatus'
import Config from 'app/collections/config'

Meteor.methods({
	update_first_status_last_fetch_details : function( mongoid ){
		var dataToUpdate = {
  			'status_last_fetch_details' : {
  				"last_email_id_fetch": 0*1,
				"last_email_fetch_date" : ""
  			}
  		}
		Config.update( mongoid, { $set: dataToUpdate})
		return true
  	},
  	update_status_last_fetch_details : function( mongoid, last_email_id_fetch, last_email_fetch_date ){
		var dataToUpdate = {
  			'status_last_fetch_details' : {
  				"last_email_id_fetch": last_email_id_fetch*1,
				"last_email_fetch_date" : last_email_fetch_date
  			}
  		}
		Config.update( mongoid, { $set: dataToUpdate})
		return true
  	},


  doUpdateEmailsStore: function ( mongoid ) {
  	//mongoid is id of record in config table

  	var date = new Date()
	var todaysDate = moment(date).format("YYYY-MM-DD")

  	//check fog logged user
	if( Meteor.user() == null ){
		return {
			'type' : 'INVALID_LOGIN',
		}
	}

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
			if( mongoid == imapEmail._id._str ){
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

  			if( typeof settings.status_last_fetch_details != 'undefined' ){

  				var status_last_fetch_details = settings.status_last_fetch_details
				fetchingEmailsFromId = status_last_fetch_details.last_email_id_fetch + 1
				fetchingEmailsForDate = status_last_fetch_details.last_email_fetch_date
				if( fetchingEmailsForDate == ''){
					fetchingEmailsForDate = todaysDate
				}
  			}else{
  				Meteor.call('update_first_status_last_fetch_details', source_mongoid )
				fetchingEmailsFromId = ''
				fetchingEmailsForDate = todaysDate
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

					if( typeof json.data != 'undefined' && typeof json.data.emails != 'undefined' ){
						TYPE = "SUCCESS"

						if( json.data.emails.length > 0 ){
							var emails_to_be_fetched = json.data.count
			    			var emails = json.data.emails
							
							var last_email_id = ''
							var last_email_date = ''

							_.forEach( emails, function( email ){
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
								Meteor.call('insertNewEmail', source_email_id, email  )
								emails_fetched++
							})

							//-start-insert status last inserted email id to db
							if( last_email_id != '' && last_email_date != '' ){
								Meteor.call('update_status_last_fetch_details', source_mongoid, last_email_id, last_email_date )
							}
							//-end-insert status last inserted email id to db
						}

		    		}else{
		    			TYPE = "RESPONSE_ERROR"
		    			MESSAGE = json
		    		}
		    	}
		    	
				return {
		    		'type' : TYPE,
		    		'message' : MESSAGE,
		    		'emails_fetched' : emails_fetched,
					'emails_to_be_fecthed' : emails_to_be_fetched
		    	}
		  	} catch (e) {
		    	return e ;
		  	}


		}
		
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	
  },
  insertNewEmail : function ( source_email_id, emailData ){
  	var currentDateTime = new Date()
	emailData.m_source_email_id = source_email_id
  	emailData.m_insert_time = currentDateTime
  	emailData.m_insert_timestamp = currentDateTime.getTime()*1,
  	emailData.m_read_status = 0*1
	EmailsStore.insert( emailData );
  },
  getEmailsForInbox : function( emails_per_page, page_num ){
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
	if( totalPages > 0 && next_page > totalPages){
		next_page = ''
	}

	var allEmails = EmailsStore.find( {}, { sort: {email_timestamp: -1}, skip : skip, limit: emails_per_page }).fetch()

  	if( allEmails.length > 0 ){
  		allEmails = _.map( allEmails, function( email ){
  			let email_date = email.email_date
  			email.email_date = moment(email_date).format("dddd, Do MMM")
  			return email
  		})
  	}

  	return {
		emails : allEmails,
		previous_page : previous_page,
		next_page : next_page
  	}
  }
});

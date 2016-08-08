import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'

import {config_ENV} from './../config';

import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import EmailsStoreStatus from 'app/collections/EmailsStoreStatus'

Meteor.methods({
  doUpdateEmailsStore: function () {

  	//check fog logged user
	if( Meteor.user() == null ){
		return 'INVALID_LOGIN'
	}

	//check for imap settings
	var checkSettings = Meteor.call('fetchSettings')
	if( checkSettings.length == 0 ){
		return 'SETTINGS_NOT_FOUND'		
	}else{
		var settings = checkSettings[0]
		
		var source_email_id = settings.emailId
  		var source_email_password = settings.password
  		var source_host = settings.server
  		var source_port = settings.port
  		var source_encryp = settings.encrypt
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  	var date = new Date()
	var todaysDate = moment(date).format("YYYY-MM-DD")

	var last_email_id_stored_details = Meteor.call('getLastEmailidStoredDetails', source_email_id )

	var fetchingEmailsFromId = ''
	var fetchingEmailsForDate = ''

	if( last_email_id_stored_details != false ){
		var last_email_id_stored = last_email_id_stored_details.last_email_id_fetch

		fetchingEmailsFromId = last_email_id_stored + 1
		fetchingEmailsForDate = last_email_id_stored_details.last_email_fetch_date
		if( fetchingEmailsForDate == ''){
			fetchingEmailsForDate = todaysDate	
		}

	}else{
		fetchingEmailsFromId = ''
		fetchingEmailsForDate = todaysDate
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var BASE_URL = config_ENV.IMAP_API_BASE_URL
	var PARAMS = ""
	if( fetchingEmailsFromId == ''){
		PARAMS = "email="+source_email_id+"&pass="+source_email_password+"&date="+fetchingEmailsForDate+"&host="+source_host+"&port="+source_port+"&encryp="+source_encryp
	}else{
		PARAMS = "email="+source_email_id+"&pass="+source_email_password+"&date="+fetchingEmailsForDate+"&host="+source_host+"&port="+source_port+"&encryp="+source_encryp+"&email_id="+fetchingEmailsFromId
	}
	var API_URL = BASE_URL + PARAMS
	
	try {
		var ret = 0
    	var result = HTTP.call("GET", API_URL );
    	if( typeof result.content != 'undefined' ){
    		var json = JSON.parse( result.content )
			if( typeof json.data != 'undefined' && json.data.length > 0 ){
    			var emails = json.data
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
					ret++
				})

				//-start-insert status last inserted email id to db
				if( last_email_id != '' && last_email_date != '' ){
					Meteor.call('updateEmailsStoreStatus', source_email_id, last_email_id, last_email_date )
				}
				//-end-insert status last inserted email id to db
    		}
    	}
    	return ret;
  	} catch (e) {
    	return e ;
  	}
  },
  getLastEmailidStoredDetails : function( emailid ){
  	var checkExisting = EmailsStoreStatus.find({ 'source_email_id' : emailid }).fetch()
  	if( checkExisting.length > 0 ){
  		var record = checkExisting[0]
  		return record
  	}else{
  		Meteor.call('insertNewEmailStoreStatus', emailid )
  		return false
  	}
  },
  insertNewEmailStoreStatus : function( emailid ){
	EmailsStoreStatus.insert({
		source_email_id : emailid,
    	last_email_id_fetch : 0*1,
    	last_email_fetch_date : ''
    });
  },
  updateEmailsStoreStatus: function( source_email_id, last_email_id_fetch, last_email_fetch_date ){
  	var where = {
  		source_email_id : source_email_id
  	}
	EmailsStoreStatus.update( where, { $set: { 
		last_email_id_fetch: last_email_id_fetch*1,
		last_email_fetch_date : last_email_fetch_date
	}});
  },
  insertNewEmail : function ( source_email_id, emailData ){
  	var currentDateTime = new Date()
	emailData.m_source_email_id = source_email_id
  	emailData.m_insert_time = currentDateTime
  	emailData.m_insert_timestamp = currentDateTime.getTime()*1,
  	emailData.m_read_status = 0*1
	EmailsStore.insert( emailData );
  }
});
import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import * as _ from 'lodash'

import EmailsStore from 'app/collections/EmailsStore'
import EmailsStoreStatus from 'app/collections/EmailsStoreStatus'


Meteor.methods({
  doUpdateEmailsStore: function () {
  	var source_email_id = 'exceltes@gmail.com'
  	var source_email_password = 'java@123'
  	var source_host = 'imap.gmail.com'
  	var source_port = '993'
  	var source_encryp = 'ssl'

	var last_email_id_stored = Meteor.call('getLastEmailidStored', source_email_id )

	var date = new Date()
	//--data to fetch new emails
	var todaysDate = moment(date).format("YYYY-MM-DD")
	var start_fetch_from_email_id = ""
	if( last_email_id_stored != false ){
		start_fetch_from_email_id = last_email_id_stored + 1
	}

	//-----
	var BASE_URL = "http://excellencetechnologies.co.in/imap/?"
	var PARAMS = ""
	if( start_fetch_from_email_id == ''){
		PARAMS = "email="+source_email_id+"&pass="+source_email_password+"&date="+todaysDate+"&host="+source_host+"&port="+source_port+"&encryp="+source_encryp
	}else{
		PARAMS = "email="+source_email_id+"&pass="+source_email_password+"&date="+todaysDate+"&host="+source_host+"&port="+source_port+"&encryp="+source_encryp+"&email_id="+start_fetch_from_email_id
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
    			for( var k in emails ){
					var email = emails[k]
					if( typeof email.email_id != 'undefined' ){
						if( last_email_id == ''){
							last_email_id = email.email_id
						}else{
							if( email.email_id > last_email_id ){
								last_email_id = email.email_id
							}
						}				
					}
					Meteor.call('insertNewEmail', source_email_id, email  )
					ret++
				}
				//-start-insert status last inserted email id to db
				if( last_email_id != '' ){
					Meteor.call('updateEmailsStoreStatus', source_email_id, last_email_id )
				}
				//-end-insert status last inserted email id to db
    		}
    	}
    	return ret;
  	} catch (e) {
    	return e ;
  	}
  },
  getLastEmailidStored : function( emailid ){
  	var checkExisting = EmailsStoreStatus.find({ 'source_email_id' : emailid }).fetch()
  	if( checkExisting.length > 0 ){
  		var record = checkExisting[0]
  		return record.last_email_id_fetch
  	}else{
  		Meteor.call('insertNewEmailStoreStatus', emailid )
  		return false
  	}
  },
  insertNewEmailStoreStatus : function( emailid ){
	EmailsStoreStatus.insert({
		source_email_id : emailid,
    	last_email_id_fetch : 0*1
    });
  },
  updateEmailsStoreStatus: function( source_email_id, last_email_id_fetch ){
  	var where = {
  		source_email_id : source_email_id
  	}
	EmailsStoreStatus.update( where, { $set: { last_email_id_fetch: last_email_id_fetch*1 } });
  },
  insertNewEmail : function ( source_email_id, emailData ){
  	var currentDateTime = new Date()
	emailData.m_source_email_id = source_email_id
  	emailData.m_insert_time = currentDateTime
  	emailData.m_insert_timestamp = currentDateTime.getTime()*1
	EmailsStore.insert( emailData );
  }
});
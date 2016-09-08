import * as _ from 'lodash'
import { Meteor } from 'meteor/meteor'
import Config from '../../collections/config'
import Tags  from '../../collections/inboxTag';
import EmailsStore from '../../collections/EmailsStore';
import {matchTag} from '../inboxTag/matchTag';

//m_insert_timestamp
var iq=0;
Meteor.methods({
  applyTagToAll: function(tagToApply){
    SyncedCron.add({
      tag: tagToApply,
      name: tagToApply.name,
      timeStamp: new Date().getTime(),
      limit: 200,
      skip: 0,
      assignTag : function ( emailData, tag){
        matchTag( emailData, tag);
      },
      schedule: function(parser) {
        return parser.text('every 3 mins');
      },
      job: function () {
        let emails = EmailsStore.find({m_insert_timestamp:{$lt: this.timeStamp}},{skip: this.skip, limit: this.limit}).fetch();
        let timeStamp = 0;
        _.forEach( emails, ( email, i ) => {
        //  timeStamp = email.m_insert_timestamp;
          this.assignTag(email, this.tag);
          _.forEach(email.more_emails, ( mEmail, j ) => {
            //this.assignTag(mEmail, this.tag);
            //console.log('\------> ', j+1);
          });
          console.log(i+1);
        })
        if(emails.length < this.limit && emails.length > 0){
          SyncedCron.remove(this.name);
        }else{
        //  if( timeStamp < this.timeStamp ){
          //  this.timeStamp = timeStamp;
        //  }
        this.skip += this.limit;
        console.log(this.skip);
        }
        console.log(++iq);
      }
    });
  }

});

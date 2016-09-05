import * as _ from 'lodash'
import { Meteor } from 'meteor/meteor'
import Config from '../../collections/config'
import Tags  from '../../collections/inboxTag';
import EmailsStore from '../../collections/EmailsStore';

//m_insert_timestamp
var iq=0;
Meteor.methods({
  applyTagToAll: function(tagToApply){;
    SyncedCron.add({
      tag: tagToApply,
      name: tagToApply.name,
      timeStamp: new Date().getTime(),
      limit: 500,
      skip: 0,
      assignTag : function( emailData, tag){
        try{
            if(tag.automatic){
              if(tag.email == emailData.sender_mail ||
                  emailData.subject.search(tag.subject) > -1 ||
                    emailData.subject.search(tag.name) > -1  ||
                      (moment(moment(emailData.m_insert_timestamp).format('YYYY/MM/DD')).isSameOrBefore(tag.to) &&
                        moment(tag.from).isSameOrAfter(moment(emailData.m_insert_timestamp).format('YYYY/MM/DD')))){
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
            EmailsStore.update({_id: emailData._id}, {$set:{tags: emailData.tags}});
        }catch(exception){
          console.log("error in assignTag method -->>", exception);
        }
      },
      schedule: function(parser) {
        return parser.text('every 5 mins');
      },
      job: function () {
        console.log(this);
        let emails = EmailsStore.find({m_insert_timestamp:{$lt: this.timeStamp}},{skip: this.skip, limit: this.limit}).fetch();
        let timeStamp = 0;
        _.forEach( emails, ( email, i ) => {
          timeStamp = email.m_insert_timestamp;
          this.assignTag(email, this.tag);
          _.forEach(email.more_emails, ( mEmail, j ) => {
            //this.assignTag(mEmail, this.tag);
            console.log('\------> ', j+1);
          });
          console.log(i+1);
        })
        if(emails.length < this.limit && emails.length > 0){
          SyncedCron.remove(this.name);
        }else{
          if( timeStamp < this.timeStamp ){
            this.timeStamp = timeStamp;
          }
        }
        console.log(++iq);
      }
    });
    SyncedCron.start();
  }

});

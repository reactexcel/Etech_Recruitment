import EmailsStore from '../../collections/EmailsStore';

export function matchTag ( emailData, tag) {
let  subReg = new RegExp(_.trim(tag.subject), 'ig');
let  nameReg = new RegExp(_.trim(tag.name), 'ig');
let emailDate = moment(emailData.m_insert_timestamp).format('YYYY/MM/DD');
let assign = false;
  try{
      if(tag.automatic){
        if(tag.email == emailData.sender_mail){
          assign = true;
        }else if(emailData.subject.search(subReg) > -1 ){
          assign = true;
        }else if( (tag.email == emailData.sender_mail || emailData.subject.search(subReg) > -1 ) &&
          moment( emailDate ).isBetween(tag.from,tag.to,null,'[]' ) ){
          assign = true;
        }else if( (tag.email == '' && tag.subject == '' ) &&
          moment( emailDate ).isBetween(tag.from,tag.to,null,'[]' ) ){
          assign = true;
        }

        if(assign){
          if(_.indexOf(emailData.tags, tag._id) == -1){
            emailData.tags.push(tag._id);
          }
        }
      }
      if(!tag.automatic){
        if(emailData.subject.search(nameReg) > -1){
          if(_.indexOf(emailData.tags, tag._id) == -1 && !tag.default){
            emailData.tags.push(tag._id);
          }
        }
      }
      EmailsStore.update({_id: emailData._id}, {$set:{tags: emailData.tags}});
  }catch(exception){
    console.log("error in assignTag method -->>", exception);
  }
}

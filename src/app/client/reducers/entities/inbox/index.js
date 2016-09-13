import Immutable from 'immutable'
import _ from 'lodash'

let initialState = {
	status_inbox : '',
	emails : [],
	previous_page : '',
	next_page : '',
    emails_fetch_status : [],
    count_unread_emails : "",
	tag:"",
    tagList:[]
}

export function inbox( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS_INBOX' ){
		return state.set('emails', action.payload.emails )
        .set('previous_page', action.payload.previous_page )
        .set('next_page', action.payload.next_page )
        .set('count_unread_emails', action.payload.count_unread_emails )
        .set('tag', action.payload.tag )
        .set('tagList', action.payload.tagList )

    }else if( action.type == 'ACTION_EMPTY_INBOX' ){

        return state.set('status_inbox', action.payload )

    }else if( action.type == 'ACTION_ERROR_INBOX' ){

        return state.set('status_inbox', action.payload)

    }else if( action.type == 'ACTION_SUCCESS_EMAILS_FETCH_STATUS' ){

        return state.set('emails_fetch_status', action.payload)

    }else if(action.type == 'ASSIGN_TAG'){
          let emails = state.get("emails")
          let tagList = state.get("tagList")
          let count_unread_emails = state.get("count_unread_emails")
          let data = action.payload.email
          let tagUnreadCount = false
            _.map(data,(assign)=>{
              _.map(emails,(email)=>{
                if(_.isEmpty(email.tags)){
                  tagUnreadCount = true
                }
                if(assign._id === email._id){
                     email.tags = assign.tags;
                }
              })
              _.map(tagList,(tag)=>{
                if(tag.tagId === action.payload.tagId && assign.m_read_status !== 1 ){
                  tag.count++
                  if(tagUnreadCount){
                    count_unread_emails--
                  }
                }
              })
            })
          return state.set("emails",_.clone(emails))
                      .set("tagList",_.clone(tagList))
                      .set("count_unread_emails",_.clone(count_unread_emails))
		}else if( action.type == 'ACTION_UPDATE_EMAIL_DATA' ){
        let data = action.payload
        let emails = state.get('emails')
        _.map(emails, (email)=>{
          if(email._id === data[0]._id){
              email.unread = data[0].unread
          }
        })
      return state.set('emails', emails)
    }else if(action.type == 'ACTION_UPDATE_PROGRESS_STATUS'){
      let data = action.payload;
      let emails = state.get("emails")
      _.map(data,(prog)=>{
        _.map(emails,(email)=>{
          if(prog.emailId == email._id){
            email.progresStatus = prog.progress
          }
        })
      })
      return state.set("emails",_.clone(emails))
    }else if(action.type == 'REMOVE_TAG_FROM_CANDIDATE'){
       let data = action.payload;
       let emails = state.get("emails")
       _.map(emails,(email)=>{
                if(data._id == email._id){
                    email.tags = data.tags
                }
        })
        return state.set('emails', _.clone(emails))
    }
    return state
}

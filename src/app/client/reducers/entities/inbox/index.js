import Immutable from 'immutable'

let initialState = {
	status_inbox : '',
	emails : [],
	previous_page : '',
	next_page : '',
    emails_fetch_status : [],
    count_unread_emails : "",
		tag:""
}

export function inbox( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS_INBOX' ){
		return state.set('emails', action.payload.emails )
        .set('previous_page', action.payload.previous_page )
        .set('next_page', action.payload.next_page )
        .set('count_unread_emails', action.payload.count_unread_emails )
        .set('tag', action.payload.tag )

    }else if( action.type == 'ACTION_EMPTY_INBOX' ){

        return state.set('status_inbox', action.payload )

    }else if( action.type == 'ACTION_ERROR_INBOX' ){

        return state.set('status_inbox', action.payload)

    }else if( action.type == 'ACTION_SUCCESS_EMAILS_FETCH_STATUS' ){
        
        return state.set('emails_fetch_status', action.payload)

    }else if(action.type == 'ASSIGN_TAG'){

	}else if( action.type == 'ACTION_UPDATE_EMAIL_DATA' ){
        let data = action.payload
        let emails = state.get('emails')
        _.map(emails, (email)=>{
            if(email._id === data[0]._id){
                email.m_read_status = data[0].m_read_status
            }
        })
      return state.set('emails', emails)
    }
    return state
}

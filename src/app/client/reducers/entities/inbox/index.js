import Immutable from 'immutable'

let initialState = {
	status_inbox : '',
	emails : [],
	previous_page : '',
	next_page : '',
    emails_fetch_status : [],
    count_unread_emails : ""
}

export function inbox( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS_INBOX' ){
		return state.set('emails', action.payload.emails )
        .set('previous_page', action.payload.previous_page )
        .set('next_page', action.payload.next_page )
        .set('count_unread_emails', action.payload.count_unread_emails )

    }else if( action.type == 'ACTION_EMPTY_INBOX' ){
        
        return state.set('status_inbox', action.payload )

    }else if( action.type == 'ACTION_ERROR_INBOX' ){
        
        return state.set('status_inbox', action.payload)

    }else if( action.type == 'ACTION_SUCCESS_EMAILS_FETCH_STATUS' ){
        //return state
        return state.set('emails_fetch_status', action.payload)

    }
    return state
}
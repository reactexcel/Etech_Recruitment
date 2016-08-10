import Immutable from 'immutable'

let initialState = {
	status_inbox : '',
	emails : [],
	previous_page : '',
	next_page : ''
}

export function inbox( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS_INBOX' ){
		return state.set('emails', action.payload.emails )
        .set('previous_page', action.payload.previous_page )
        .set('next_page', action.payload.next_page )

    }else if( action.type == 'ACTION_EMPTY_INBOX' ){
        
        return state.set('status_inbox', action.payload )

    }else if( action.type == 'ACTION_ERROR_INBOX' ){
        
        return state.set('status_inbox', action.payload)

    }
    return state
}
import Immutable from 'immutable'

let initialState = {
	status_new_emails : ''
}

export function home( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS_NEW_EMAILS' ){
        return state.set('status_new_emails', action.payload )
    }else if( action.type == 'ACTION_EMPTY_NEW_EMAILS' ){
        return state.set('status_new_emails', action.payload )
    }else if( action.type == 'ACTION_ERROR_NEW_EMAILS' ){
        return state.set('status_new_emails', action.payload)
    }
    return state
}
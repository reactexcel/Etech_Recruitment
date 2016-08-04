import Immutable from 'immutable'

let initialState = {
	status : ''
}

export function forgotpassword( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS' ){
        return state
    }else if( action.type == 'ACTION_FAIL' ){
        return state
    }else if( action.type == 'ACTION_ERROR' ){
        return state
    }else{
        return state
    }
}
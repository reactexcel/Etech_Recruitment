import Immutable from 'immutable'

let initialState = {
	status : ''
}


 
export function forgotpassword( state = Immutable.Map(initialState), action ){
    if( action.type == 'ACTION_SUCCESS_FORGOT_PASSOWORD' ){
        return state.set('status', action.payload )
    }else if( action.type == 'ACTION_ERROR_FORGOT_PASSOWORD' ){
        return state.set('status', action.payload )
    }else{
        return state.set('status', '')
    }

    return state
}
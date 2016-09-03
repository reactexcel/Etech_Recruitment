import Immutable from 'immutable'
import {ACTION_SUCCESS_EMAIL_DATA,
        ACTION_ERROR_EMAIL_DATA} from '../../../actions/emailDetails'

let initialState = {}

export function email( state = Immutable.Map(initialState), action ){
    if( action.type == ACTION_SUCCESS_EMAIL_DATA ){
        return state = action.payload

    }else if( action.type == ACTION_ERROR_EMAIL_DATA ){
        
        return state = action.payload

    }
    return state
}
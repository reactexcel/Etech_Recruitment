import Immutable from 'immutable';
import _ from 'lodash';
let initialState={
    status_history:'',
    history:[]
}
export function history(state=Immutable.Map(initialState),action){
    if( action.type == 'ACTION_FOUND_HISTORY' ){
        return state.set('history', action.payload.history )
   }else if( action.type == 'ACTION_EMPTY_HISTORY' ){    
       return state.set('status_history', action.payload )
   }else if( action.type == 'ACTION_ERROR_HISTORY' ){    
       return state.set('status_history', action.payload)
   }
    return state
}
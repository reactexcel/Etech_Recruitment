import Immutable from 'immutable';
import _ from 'lodash';
let initialState={
    status_log:'',
    logs:[]
}
export function logs(state=Immutable.Map(initialState),action){
    if(action.type=='ADD_LOG'){
        return state.set('log',action.payload)
    }else if( action.type == 'ACTION_FOUND_LOG' ){
        return state.set('logs', action.payload.logs )
   }else if( action.type == 'ACTION_EMPTY_LOG' ){    
       return state.set('status_log', action.payload )
   }else if( action.type == 'ACTION_ERROR_LOG' ){    
       return state.set('status_log', action.payload)
   }
    return state
}

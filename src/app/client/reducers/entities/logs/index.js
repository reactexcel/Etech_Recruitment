import Immutable from 'immutable';
import _ from 'lodash';
let initialState={
    status_log:'',
    logs:[],
    previous_page : '',
    next_page : ''
}
export function logs(state=Immutable.Map(initialState),action){
    if(action.type=='ADD_LOG'){
        return state.set('log',action.payload)
    }else if( action.type == 'ACTION_FOUND_LOG' ){
        return state.set('logs', action.payload.logs )
       .set('previous_page', action.payload.previous_page )
       .set('next_page', action.payload.next_page )
   }else if( action.type == 'ACTION_EMPTY_LOG' ){    
       return state.set('status_log', action.payload )
   }else if( action.type == 'ACTION_ERROR_LOG' ){    
       return state.set('status_log', action.payload)
   }
    return state
}

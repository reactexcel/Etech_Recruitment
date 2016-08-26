import Immutable from 'immutable';
import _ from 'lodash';
let initialState={
    status_history:'',
    history:[]
}
export function candidateHistory(state=Immutable.Map(initialState),action){
    if( action.type == 'ACTION_FOUND_HISTORY' ){
        return state.set('history', action.payload)
                     .set('status_history', '')
   }else if( action.type == 'ACTION_EMPTY_HISTORY' ){    
       return state.set('status_history', action.payload )
				   .set('history', [])
   }else if( action.type == 'ACTION_ERROR_HISTORY' ){    
       return state.set('status_history', action.payload)
				   .set('history', [])
   }
    return state
}
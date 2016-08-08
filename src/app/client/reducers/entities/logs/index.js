import Immutable from 'immutable';
import _ from 'lodash';
let initialState={
	'logs':{}
}
export function logs(state=Immutable.Map(initialState),action){
	if(action.type=='ADD_LOG'){
		state.set('logs',action.payload)
	}
	return state;
}

import Immutable from 'immutable';
import _ from 'lodash';
let initialState={
	'log':{}
}
export function logs(state=Immutable.Map(initialState),action){
	if(action.type=='ADD_LOG'){
		state.set('log',action.payload)
	}
}
import Immutable from 'immutable';
import * as ACTION from '../../../actions/variable';
import _ from 'lodash';

let initialState = Immutable.List([]);
export function variables(state=initialState,action){
	if(action.type === ACTION.ACTION_SUCCESS_FETCH_VARIABLE){
		let stateClone = state;
		stateClone = action.payload;
		return stateClone;
	}else{
		return state
	}
}
import Immutable from 'immutable';
import * as ACTION from '../../../actions/dynamicActions';
import _ from 'lodash';

let initialState = Immutable.List([]);

export function dynamicAction(state = initialState, action){
	if (action.type === ACTION.ACTION_SUCCESS_FETCH_ACTION) {
		let stateclon=state;
		stateclon=action.payload;
		return stateclon;
	}else{
		return state
	}
}
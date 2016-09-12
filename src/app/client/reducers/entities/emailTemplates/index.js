import Immutable from 'immutable';
import * as ACTION from '../../../actions/emailTemplates';
import _ from 'lodash';

let initialState = Immutable.List([]);

export function emailTemplates(state = initialState, action){
	if (action.type === ACTION.ACTION_SUCCESS_FETCH_TEMPLATE) {
		let stateclon=state;
		stateclon=action.payload;
		return stateclon;
	}else{
		return state
	}
}
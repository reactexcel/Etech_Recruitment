import Immutable from 'immutable';
import * as ACTION from '../../../actions/manageUsers';
import _ from 'lodash';

let initialState = Immutable.List([]);
export function userList(state=initialState,action){
	if(action.type === ACTION.ACTION_SUCCESS_FETCH_USERS){
		let stateClone = state;
		stateClone = action.payload;
		return stateClone;
	}else{
		return state
	}
}
import Immutable from 'immutable';

import { ADD_USER } from '../../actions'



export function register(state = Immutable.fromJS({}),action){
	switch(action.type){
		case ADD_USER:
			state = Immutable.fromJS(action.payload)
			return state

		default:
			return state
	}

}

import Immutable from 'immutable';

import { ADD_USER } from '../actions'



export function register(state = Immutable.fromJS({}),action){
	switch(action.type){
		case ADD_USER:
			state = Immutable.fromJS(action.payload)
			console.log(state)
			return _.clone(state)

		default:
			return _.clone(state)
	}

}

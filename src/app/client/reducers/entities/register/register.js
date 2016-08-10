import Immutable from 'immutable';
import { combineReducers } from 'redux-immutable'




import { ADD_USER } from '../../../actions/register'



function register(state = Immutable.List([]),action){
	switch(action.type){
		case ADD_USER:
			state = action.payload
			return state

		default:
			return state
	}

}



export default combineReducers({
register
})
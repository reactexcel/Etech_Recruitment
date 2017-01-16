import Immutable from 'immutable'
import _ from 'lodash'

let initialState = {
	tagList:[]
}

export function dashboard( state = Immutable.Map(initialState), action ){
	if( action.type == 'FETCH_TAG_FOR_DASH' ){
		return state.set('tagList', action.payload )
	}
	return state
}
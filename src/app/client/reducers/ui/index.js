import Immutable from 'immutable';
import {LOADING} from '../../actions/users'

 export function ui(state = Immutable.fromJS({}),action){
	

  if(action.type === LOADING){
  	state.set('loading',action.payload)
  }
   return state;
 }
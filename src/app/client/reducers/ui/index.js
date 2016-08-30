import Immutable from 'immutable';
import {LOADING} from '../../actions/users'

 export function ui(state = Immutable.Map({loading: false}),action){


  if(action.type === 'LOADING'){
  	return state.set('loading',action.payload)
  }
   return state;
 }

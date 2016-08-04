import {LOGIN,GET_USER} from '../../actions/users';
import Immutable from 'immutable';
export function users(state = Immutable.fromJS({}),action){
  if(action.type === LOGIN){

    state = Immutable.fromJS(action.payload)

  }else if(action.type === GET_USER){

    state = Immutable.fromJS(action.payload)
    
  }
  return state;
} 
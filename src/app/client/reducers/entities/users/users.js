import Immutable from 'immutable';
let initialState={
	'users' : {}
}
export function users(state = Immutable.Map(initialState),action){


  if(action.type == 'LOGIN'){
      state.set('users',action.payload)

  }else if(action.type == 'GET_USER' ){
      state.set('users',action.payload)
    
  }
  return state;
} 
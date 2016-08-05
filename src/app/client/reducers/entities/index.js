import {combineReducers} from 'redux-immutable';
import {users} from './users/users';
import register from './register'


export default combineReducers({
	users,
	register
})	

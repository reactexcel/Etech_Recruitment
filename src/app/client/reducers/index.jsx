import {users} from './entries/users';
import {ui} from './ui/index';
import {combineReducers} from 'redux-immutable';

export default combineReducers({
	users,
	ui
})
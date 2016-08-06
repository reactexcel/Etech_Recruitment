import {combineReducers} from 'redux-immutable';
import {users} from './users/users';
import register from './register'
import { forgotpassword } from './forgotpassword'
import {logs} from './logs'
import { home } from './home'


export default combineReducers({
	users,
	register,
	forgotpassword,
	logs,
	home
})	


import {combineReducers} from 'redux-immutable';
import {users} from './users/users';
import register from './register'
import { forgotpassword } from './forgotpassword'
import {logs} from './logs'


export default combineReducers({
	users,
	register,
	forgotpassword,
	logs
})	


import { combineReducers } from 'redux-immutable';
import {users} from './users/users';
import register from './register/register'
import { forgotpassword } from './forgotpassword'
import {logs} from './logs'
import { home } from './home'
import { email } from './email'
import { emailSetting } from './emailSetting';
import { inbox } from './inbox';
import {history} from './candidateHistory'
export default combineReducers({
	users,
	register,
	forgotpassword,
	logs,
	home,
	emailSetting,
	inbox,
	email,
	history
})
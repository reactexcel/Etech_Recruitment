import { combineReducers } from 'redux-immutable';
import {users} from './users/users';
import register from './register/register'
import { forgotpassword } from './forgotpassword'
import {logs} from './logs'
import { home } from './home'
import { emailSetting } from './emailSetting';
import { inbox } from './inbox';
import { inboxTag } from './inboxTag';
export default combineReducers({
	users,
	register,
	forgotpassword,
	logs,
	home,
	emailSetting,
	inbox,
	inboxTag,
})

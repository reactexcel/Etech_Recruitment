import { combineReducers } from 'redux-immutable';
import {users} from './users/users';
import register from './register/register'
import { forgotpassword } from './forgotpassword'
import {logs} from './logs'
import { emailSetting } from './emailSetting';

export default combineReducers({
	users,
	register,
	forgotpassword,
	logs,
    emailSetting
});

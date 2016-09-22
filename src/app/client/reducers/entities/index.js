import { combineReducers } from 'redux-immutable';
import {users} from './users/users';
import register from './register/register'
import { forgotpassword } from './forgotpassword'
import {logs} from './logs'
import { home } from './home'
import { email } from './email'
import { emailSetting } from './emailSetting';
import { testDetails } from './emailSetting';
import { inbox } from './inbox';
import {candidateHistory} from './candidateHistory'
import { inboxTag } from './inboxTag';
import { emailTemplates } from './emailTemplates';
import { dynamicAction } from './dynamicAction';
import {variables} from './variables';
import {userList} from './manageUsers';
import {dashboard} from './dashboard';
export default combineReducers({
	users,
	register,
	forgotpassword,
	logs,
	home,
	emailSetting,
	inbox,
	candidateHistory,
	inboxTag,
	email,
	emailTemplates,
	testDetails,
	dynamicAction,
	variables,
	userList,
	dashboard
})

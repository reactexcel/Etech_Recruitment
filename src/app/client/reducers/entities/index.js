<<<<<<< HEAD
import { combineReducers } from 'redux-immutable'

import { forgotpassword } from './forgotpassword'

export default combineReducers({
	forgotpassword
})
=======
import {combineReducers} from 'redux-immutable';
import {users} from './users/users';
import register from './register'


export default combineReducers({
	users,
	register
})	
>>>>>>> 0ead7c3fcbeb335eaf8b811270a2823ea5dbd972

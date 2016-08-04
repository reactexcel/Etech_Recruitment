import {combineReducers} from 'redux-immutable';
import {sendMail} from './sendMail';

const reducer = combineReducers({
  sendMail
});

export {reducer};

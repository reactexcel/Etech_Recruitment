import Immutable from 'immutable';
import * as ACTION from '../../../actions/emailSetting';
import _ from 'lodash';
let initialState = Immutable.List([]);

export function checkSmtpImap (state = initialState, action ){
  if (action.type === ACTION.CHECK_SMTP_IMAP) {
    let nextState=[];
    nextState.push(Immutable.Map(action.payload));
    return Immutable.List(nextState);
  }
  return state;
}

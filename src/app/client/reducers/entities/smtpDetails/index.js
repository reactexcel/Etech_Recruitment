import Immutable from 'immutable';
import * as ACTION from '../../../actions/emailSetting';
import _ from 'lodash';
let initialState = Immutable.List([]);

export function smtpDetails (state = initialState, action ){
  if (action.type === ACTION.FETCH_SETTINGS_FROM_DB) {
    let nextState=[];
     _.map(action.payload, ( value ) => {
       if(typeof value.smtp != 'undefined'){
       nextState.push(Immutable.Map(value));
    }
    });
    return Immutable.List(nextState);
  }
  return state;
}

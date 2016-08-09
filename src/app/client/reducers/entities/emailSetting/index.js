import Immutable from 'immutable';
import * as ACTION from '../../../actions/emailSetting';
import _ from 'lodash';
let initialState = Immutable.List([]);

export function emailSetting (state = initialState, action ){
  if (action.type === ACTION.FETCH_SETTINGS_FROM_DB) {
    const nextState = _.map(action.payload, ( value ) => {
      return Immutable.Map(value);
    });
    return Immutable.List(nextState);
  }else if (action.type === ACTION.SAVE_SETTINGS_TO_DB) {
    return state.push(Immutable.Map(action.payload));
  }else if (action.type === ACTION.UPDATE_SETTINGS_TO_DB) {
    return  state.map(
        ( value ) => {
          if(value.get("_id") === action.payload._id) {
            return value.set("emailId", action.payload.emailId)
                 .set("password", action.payload.password)
                 .set("server", action.payload.server)
                 .set("port", action.payload.port)
                 .set("encrypt", action.payload.encrypt)
          }else{
            return value;
          }
        }
      );
  }else if (action.type === ACTION.TEST_DETAILS) {
    return  state.map(
        ( value ) => {
          if(value.get("_id") === action.payload._id) {
            return value.set("status", action.payload.status)
          }else{
            return value;
          }
        }
      );
  }
  return state;
}

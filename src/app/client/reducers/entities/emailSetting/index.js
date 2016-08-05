import Immutable from 'immutable';
import * as ACTION from '../../../actions';

let initialState = Immutable.List([]);

export function emailSetting (state = initialState, action ){
  if (action.type === ACTION.FETCH_SETTINGS_FROM_DB) {
    return Immutable.List(action.payload)
  }
  if (action.type === ACTION.SAVE_SETTINGS_TO_DB) {
    return state.push(action.payload);
  }
  return state;
}

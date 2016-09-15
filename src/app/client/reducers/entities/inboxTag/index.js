  import Immutable from 'immutable';
import * as ACTION from '../../../actions/tags';
import * as UPDATE_ACTION from '../../../actions/dynamicActions';
import _ from 'lodash';
let initialState = Immutable.List([]);

export function inboxTag (state = initialState, action ){
  if (action.type === ACTION.FETCH_TAG) {
    const nextState = _.map(action.payload, ( value ) => {
      return Immutable.Map(value);
    });
    return Immutable.List(nextState);
  }else if (action.type === ACTION.ADD_TAG) {
    return state.push(Immutable.Map(action.payload));
  }else if (action.type === ACTION.EDIT_TAG) {
    return  state.map(
        ( value ) => {
          if(value.get("_id") === action.payload._id) {
            return value.set("name", action.payload.name)
                 .set("color", action.payload.color)
          }else{
            return value;
          }
        }
      );
  }else if (action.type === ACTION.REMOVE_TAG) {
    const nextState = [];
     state.map(
        ( value ) => {
            if(value.get("_id") !== action.payload) {
               nextState.push(value) ;
            }
        }
      );
      return Immutable.List(nextState);
    }
  return state;
}

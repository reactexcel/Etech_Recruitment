import {createAction} from 'redux-actions';
import {addLogs} from '../logs';

export const ADD_TAG = "ADD_TAG";
export const EDIT_TAG = "EDIT_TAG";
export const REMOVE_TAG = "REMOVE_TAG";
export const FETCH_TAG = "FETCH_TAG";


const addTag = (addTag) => {
  return createAction(ADD_TAG)(addTag);
}

const editTag = (editTag) => {
  return createAction(EDIT_TAG)(editTag);
}

const removeTag = ( _id ) => {
  return createAction(REMOVE_TAG)(_id);
}

const fetchTag = (tags) => {
  return createAction(FETCH_TAG)(tags);
}

export function onAddTag(title, color){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('addTag', title, color,(err, tag) => {
          if(err){
            reject(err);
          }else{
            dispatch(addTag(tag));
            resolve();
          }
      });
    });
  }
}

export function onEditTag(title, _id, color){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('editTag', _id, title, color,(err, tag) => {
          if(err){
            reject(err);
          }else{
            dispatch(editTag(tag));
            resolve();
          }
      });
    });
  }
}

export function onRemoveTag( _id ){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('removeTag',_id,(err) => {
          if(err){
            reject(err);
          }else{
            dispatch(removeTag(_id));
            resolve();
          }
      });
    });
  }
}

export function onFetchTag (){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('fetchTag',(err, tags) => {
          if(err){
            reject(err);
          }else{
            dispatch(fetchTag( tags ));
            resolve();
          }
      });
    });
  }
}

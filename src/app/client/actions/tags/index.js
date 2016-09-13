import {createAction} from 'redux-actions';
import {addLogs} from '../logs';
import { Meteor } from 'meteor/meteor'


export const ADD_TAG = "ADD_TAG";
export const EDIT_TAG = "EDIT_TAG";
export const REMOVE_TAG = "REMOVE_TAG";
export const FETCH_TAG = "FETCH_TAG";
export const ASSIGN_TAG = "ASSIGN_TAG";



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

const assignTag = (mail) => {
  return createAction(ASSIGN_TAG)(mail);
}
const removeCandidateTag = (data)=>{
  return createAction('REMOVE_TAG_FROM_CANDIDATE')(data)
}

export function onAddTag(tag){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('addTag', tag, (err, tag) => {
          if(err){
            reject(err);
          }else{
            if(tag == 'Tag name already exists'){
              reject(tag);
            }else{
              dispatch(addTag(tag));
              dispatch(addLogs("ADD TAG", Meteor.userId(),"tag "+ tag.name+" Added"));
              resolve(tag);
            }
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
            dispatch(addLogs("EDIT TAG",Meteor.userId(),"tag "+ tag.name+" edited"));
            resolve();
          }
      });
    });
  }
}

export function onRemoveTag( _id ){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('removeTag',_id,(err, data) => {
          if(err){
            reject(err);
          }else{
            if(typeof data.msg == 'undefined'){
              dispatch(removeTag(_id));
              dispatch(addLogs("REMOVE TAG",Meteor.userId(),"tag  removed"));
              resolve();
            }else{
              reject(data.msg);
            }
            
            
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


export function onAssignTag (m_id, t_id){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('assignTag',m_id,t_id,(err, tags) => {
          if(err){
            reject(err);
          }else{
           dispatch(assignTag(tags));
            resolve(tags);
          }
      });
    });
  }
}

export function onIgnoreMultipleCandidate (idList, tagId){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('ignoreMultipleCandidate',idList,tagId,Meteor.userId(),(err, mails) => {
          if(err){
            reject(err);
          }else{
            dispatch(assignTag(mails));
            resolve();
          }
      });
    });
  }
}

export function onRejectMultipleCandidate (idList, tagId, reason){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('rejectMultipleCandidate',idList,tagId,reason,Meteor.userId(),(err, mails) => {
          if(err){
            reject(err);
          }else{
            dispatch(assignTag(mails));
            resolve();
          }
      });
    });
  }
}

export function sendMailToCandidate(candidateIdList,name,sub,body,tagId){
  return (dispatch,getState)=>{
    return new Promise((resolve,reject)=>{
      Meteor.call('sendMailToCandidate',candidateIdList,name,sub,body,tagId,Meteor.userId(),(err,mails)=>{
        if(err){
          reject(err)
        }else{
          dispatch(assignTag(mails));
          resolve();
        }
      })
    })
  }
}

export function removeTagFromCandidate(emailId, tagId){
  return(dispatch, getState)=>{
    return new Promise((resolve,reject)=>{
      Meteor.call('removeTagFromCandidate',emailId, tagId,(err, data)=>{
        if(err){
          reject(err)
        }else{
          if(data.result){
            dispatch(removeCandidateTag(data.email));
            resolve("Tag removed")
          }else{
            resolve("Error: Not removed try again")
          }
        }
      })
    })
  }
}
import {createAction} from 'redux-actions';

export const FETCH_SETTINGS_FROM_DB = "FETCH_SETTINGS_FROM_DB";
export const SAVE_SETTINGS_TO_DB = "SAVE_SETTINGS_TO_DB";
export const UPDATE_SETTINGS_TO_DB = "UPDATE_SETTINGS_TO_DB";
export const TEST_DETAILS = "TEST_DETAILS";

const fetchSettingsFromDB = (fetchedData) => {
  return createAction(FETCH_SETTINGS_FROM_DB)(fetchedData);
}

const saveSettingsToDB = (details) => {
  return createAction(SAVE_SETTINGS_TO_DB)(details);
}

const updateSettingsToDB = (details) => {
  return createAction(UPDATE_SETTINGS_TO_DB)(details);
}

const testDetails = (_id, status) => {
  return createAction(TEST_DETAILS)({_id, status});
}

export function onFetchSettingsFromDB(){
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('fetchSettings',(err, fetchedData) => {
          if(err){
            reject(err);
          }else{
            dispatch(fetchSettingsFromDB(fetchedData));
            resolve();
          }
      });
    });
  }
}

export function onSaveSettingsToDB (detail) {
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('saveSettings',detail,(err,storeData) => {
          if(err){
            reject(err);
          }else{
            if(typeof storeData === "undefined"){
              dispatch(updateSettingsToDB(detail));
            }else{
              dispatch(saveSettingsToDB(storeData));
            }
            resolve();
          }
      });
    });
  }
}

export function onTestDetails (detail) {
  return (dispatch, getState) => {
    return new Promise( (resolve, reject) => {
      Meteor.call('checkMailServer',detail,(err,status) => {
          if(err){
            reject(err);
          }else{
            dispatch(testDetails(detail._id,status))
            resolve();
          }
      });
    });
  }
}

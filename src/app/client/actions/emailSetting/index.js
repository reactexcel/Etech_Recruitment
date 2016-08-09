import {createAction} from 'redux-actions';

export const FETCH_SETTINGS_FROM_DB = "FETCH_SETTINGS_FROM_DB";
export const SAVE_SETTINGS_TO_DB = "SAVE_SETTINGS_TO_DB";
export const UPDATE_SETTINGS_TO_DB = "UPDATE_SETTINGS_TO_DB";

const fetchSettingsFromDB = (fetchedData) => {
  return createAction(FETCH_SETTINGS_FROM_DB)(fetchedData);
}

const saveSettingsToDB = (details) => {
  return createAction(SAVE_SETTINGS_TO_DB)(details);
}

const updateSettingsToDB = (details) => {
  return createAction(UPDATE_SETTINGS_TO_DB)(details);
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

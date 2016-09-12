import { createAction } from 'redux-actions'
import * as _ from 'lodash'

//-----
export const ACTION_SUCCESS_EMAIL_DATA = "ACTION_SUCCESS_EMAIL_DATA"
export const ACTION_ERROR_EMAIL_DATA = "ACTION_ERROR_EMAIL_DATA"

const success_email = function ( data ){
    return createAction( ACTION_SUCCESS_EMAIL_DATA )( data )
}
export function update_email( data ){
    return createAction( 'ACTION_UPDATE_EMAIL_DATA' )( data )
}
export function error_email( data ){
    return createAction( ACTION_ERROR_EMAIL_DATA )( data )
}

//export const func = {}
export function getEmailData( email_id ){
    return ( dispatch, getState ) => {
        return new Promise( ( resolve, reject ) => {
            Meteor.ClientCall.methods({
              updateAttachment: function(data){
                dispatch(success_email(data));
              },
            });
            Meteor.call('getEmail', email_id,(err, data) => {
                if(err){
                    dispatch ( error_email( err ) )
                }else{
                    dispatch ( success_email( data  ) )
                    dispatch ( update_email( data  ) )
                }
            })

        })
    }
}



//------


export function tagUpdateArchive( id, tagId){
    return ( dispatch, getState ) => {
        return new Promise( ( resolve, reject ) => {
            Meteor.call('tagUpdateArchive', id, tagId, (err, data) => {
                if(err){
                    dispatch ( error_email( err ) )
                }else{
                    Meteor.call('getEmail', id, (err, data) => {
                    if(err){
                    dispatch ( error_email( err ) )
                    }else{
                    dispatch ( success_email( data  ) )
                    }
                    })
                }
            })

        })
    }
}



export function updateReject(id,tagId,reason){
    return ( dispatch, getState ) => {
        return new Promise( ( resolve, reject ) => {
            Meteor.call('tagUpdateReject', id,tagId,reason, (err, data) => {
                if(err){
                    dispatch ( error_email( err ) )
                }else{
                    Meteor.call('getEmail', id, (err, data) => {
                    if(err){
                    dispatch ( error_email( err ) )
                    }else{
                    dispatch ( success_email( data  ) )
                    }
                    })
                }
            })

        })
    }
}

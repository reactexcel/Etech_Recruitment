import { createAction } from 'redux-actions'
import * as _ from 'lodash'

//-----
export const ACTION_SUCCESS_EMAIL_DATA = "ACTION_SUCCESS_EMAIL_DATA"
export const ACTION_ERROR_EMAIL_DATA = "ACTION_ERROR_EMAIL_DATA"

export function success_email( data ){
    return createAction( ACTION_SUCCESS_EMAIL_DATA )( data )
}
export function error_email( data ){
    return createAction( ACTION_ERROR_EMAIL_DATA )( data )
}

export function getEmailData( email_id ){
    return ( dispatch, getState ) => {
        return new Promise( ( resolve, reject ) => {
            Meteor.call('getEmail', email_id, (err, data) => {
                if(err){
                    dispatch ( error_email( err ) )
                }else{
                    dispatch ( success_email( data  ) )
                }
            })

        })
    }
}



//-----


export function tagUpdateArchive( id, status ){
    return ( dispatch, getState ) => {
        return new Promise( ( resolve, reject ) => { 
            Meteor.call('tagsUpdateArchive', id, status, (err, data) => {
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



export function updateReject( id,reject, reason ){
    return ( dispatch, getState ) => {
        return new Promise( ( resolve, reject ) => {
            Meteor.call('tagUpdateReject', id,reject, reason, (err, data) => {
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
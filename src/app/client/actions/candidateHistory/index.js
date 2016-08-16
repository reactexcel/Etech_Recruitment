import {createAction} from 'redux-actions';
import * as _ from 'lodash'

export const ACTION_FOUND_HISTORY = "ACTION_FOUND_HISTORY"
export const ACTION_EMPTY_HISTORY = "ACTION_EMPTY_HISTORY"
export const ACTION_ERROR_HISTORY = "ACTION_ERROR_HISTORY"

export function getHistoryData(){
	return function ( dispatch, getState ){
		return new Promise( ( resolve, reject ) => {

			Meteor.call('getCandidateHistory',(err, data) => {
				console.log(data,"ggggggggggggg");
				if(err){
					dispatch ( history_error( err ) )
				}else{
					if( data.history.length == 0 ){
						dispatch ( empty_history( 'No more candidate history' ) )
					}else{
						dispatch ( history_found( data ) ) 
					}
				}
			})

		})
	}
}

export function history_found( data ){
	return createAction( ACTION_FOUND_HISTORY )( data )
}
export function empty_history( data ){
	return createAction( ACTION_EMPTY_HISTORY )( data )
}
export function history_error( data ){
	return createAction( ACTION_ERROR_HISTORY )( data )
}
import Immutable from 'immutable'
import {ACTION_SUCCESS_EMAIL_DATA,
        ACTION_ERROR_EMAIL_DATA, } from '../../../actions/emailDetails'
import {UPDATE_TAGID} from '../../../actions/dynamicActions'

let initialState = {}

export function email( state = Immutable.Map(initialState), action ){
    if( action.type == ACTION_SUCCESS_EMAIL_DATA ){
        return state = action.payload

    }else if( action.type == ACTION_ERROR_EMAIL_DATA ){
        
        return state = action.payload

    }else if(action.type == 'ACTION_UPDATE_PROGRESS_STATUS'){
    	let data = action.payload;
    	_.map(data,(prog)=>{
    		_.map(state,(email)=>{
    			if(prog.emailId == email._id){
    				email.progresStatus = prog.progress
                    email.candidateActions = prog.candidateAction
    			}
    		})
    		
    	})
    	return _.clone(state)
    }else if(action.type == 'REMOVE_TAG_FROM_CANDIDATE'){
       let data = action.payload;
       let clonestate = state
       _.map(clonestate,(email)=>{
                if(data._id == email._id){
                    email.tags = data.tags
                }
        })
       return _.clone(clonestate)
    }
    else if(action.type == 'UPDATE_TAGID'){
        let tagId = action.payload;
        let clonestate = state;
        _.map(clonestate,(email)=>{
                    email.tags.push(tagId)
              })
        return _.clone(clonestate)
    }
    return state
}
import { combineReducers } from 'redux-immutable'
import entities from './entities'
import {ui} from './ui'

export default combineReducers({
	entities,
	ui
})

import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'
import Header from './../components/generic/Header'
import Variables from './../components/variables'
import {saveVariable,fetchVariable,deleteVariable} from '../actions/variable'



class VariablesContainer extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        if (!Meteor.userId()) {
        this.props.router.push('/login');
        }
        this.props.onFetchVariables()
    }

    render(){
        return(
        	<div>
                <Variables {...this.props} />
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        variables:state.entities.variables
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onFetchVariables:()=>{
            return dispatch(fetchVariable())
        },
        onSaveVariable:(id,variable)=>{
            return dispatch(saveVariable(id,variable))
        },
        onDeleteVariable:(id)=>{
            return dispatch(deleteVariable(id))
      },
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( VariablesContainer ))

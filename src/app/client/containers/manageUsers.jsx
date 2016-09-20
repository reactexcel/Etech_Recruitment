import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as _ from 'lodash'
import Header from './../components/generic/Header'
import ManageUsers from './../components/manageUsers'
import {addLogs} from '../actions/logs'
import {addUsers,fetchUsers,deleteUser} from '../actions/manageUsers'



class ManageUsersContainer extends React.Component {
    constructor( props ){
        super( props )
    }
    componentWillMount(){
        if (!Meteor.userId()) {
        this.props.router.push('/login');
        }
        this.props.onFetchUsers()
    }

    render(){
        return(
        	<div>
                <ManageUsers {...this.props} />
        	</div>
        )
    }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
        userList:state.entities.userList
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onFetchUsers:()=>{
            return dispatch(fetchUsers())
        },
        logging: (action, id , detail) =>{
            return dispatch(addLogs(action, id , detail));
        },
        onSaveUser: (id,userDetail) =>{
            console.log(id,userDetail,"in dispatch--------")
            return dispatch(addUsers(id,userDetail))
        },
        onDeleteUser: (id)=>{
            return dispatch(deleteUser(id))
        },
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( ManageUsersContainer ))

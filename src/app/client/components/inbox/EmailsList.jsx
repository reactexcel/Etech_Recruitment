import React, {PropTypes} from 'react'

import List from 'material-ui/List'
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import EmailsListItem from './EmailsListItem';


const style = {display: 'inline-block',margin: '16px 32px 16px 0'};

class EmailsList extends React.Component {
    constructor( props ){
        super( props );
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
    }
    submitForm( evt ){
    }
    render(){


        console.log( this.props )

        let emailsList = this.props.emails.map( (email) => {
            return (
                <div key={email._id}>
                    <EmailsListItem email={email} />
                </div>
            )
        })

        return(
            <div className="row">
                 <div className="col-md-2" style={{"backgroundColor": "#fff"}}>
                    <Paper style={{display: 'inline-block',margin: '16px 32px 16px 0'}}>
                          <Menu>
                            <MenuItem primaryText="Refresh" />
                            <MenuItem primaryText="Help &amp; feedback" />
                            <MenuItem primaryText="Settings" />
                            <MenuItem primaryText="Sign out" />
                          </Menu>
                        </Paper>
                 </div>
                 <div className="col-md-10" style={{"backgroundColor": "#fff"}}>
                    <List>
                        {emailsList}
                    </List>
                 </div>
            </div>
        );
    }
}
export default EmailsList


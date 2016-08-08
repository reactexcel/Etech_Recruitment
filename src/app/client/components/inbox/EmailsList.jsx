import React, {PropTypes} from 'react'

import List from 'material-ui/List'
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import EmailsListItem from './EmailsListItem';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';


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

        let emailsList = this.props.emails.map( (email) => {
            return (
                <div key={email._id}>
                    <EmailsListItem email={email} />
                </div>
            )
        })

        return(
            <div class="container">
                    <div className="row">
                         <div className="col-xs-2" style={{"backgroundColor": "#fff"}}>
                            <Paper style={{display: 'inline-block'}}>
                                  <Menu>
                                    <MenuItem primaryText="Refresh" />
                                    <MenuItem primaryText="Help &amp; feedback" />
                                    <MenuItem primaryText="Settings" />
                                    <MenuItem primaryText="Sign out" />
                                  </Menu>
                                </Paper>
                         </div>
                         <div className="col-xs-10" style={{"backgroundColor": "#fff"}}>

                            <div className="row">
                               <nav aria-label="...">
          <ul className="pager">
            <li><a href="#">Previous</a></li>
            <li><a href="#">Next</a></li>
          </ul>
        </nav>
                            </div>

                            <List>
                                {emailsList}
                            </List>
                         </div>
                    </div>

                </div>

        );
    }
}
export default EmailsList


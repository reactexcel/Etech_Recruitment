import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

import List from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import ImapAccountsListItem from './ImapAccountsListItem'
import Menu from 'material-ui/Menu';

class ImapAccountsList extends React.Component {
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

        let imapEmailsList = this.props.emailSetting.map( (email) => {
          if(typeof email.smtp == 'undefined' && email.emailId != '')
            return (
                <div key={email._id}>
                    <ImapAccountsListItem imapEmail={email} {...this.props}/>
                </div>
            )
        })

        return(
            <div>
                <Subheader>IMAP Emails</Subheader>
              <Menu>
                {imapEmailsList}
              </Menu>
            </div>

        );
    }
}

export default withRouter(ImapAccountsList)

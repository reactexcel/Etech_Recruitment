import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

import List from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import ImapAccountsListItem from './ImapAccountsListItem'

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

        let imapEmailsList = this.props.imap_emails.map( (email) => {
            return (
                <div key={email._id}>
                    <ImapAccountsListItem imapEmail={email} {...this.props}/>
                </div>
            )
        })

        return(
            <div>
                <Subheader>IMAP Emails</Subheader>
                {imapEmailsList}
            </div>

        );
    }
}

export default withRouter(ImapAccountsList)

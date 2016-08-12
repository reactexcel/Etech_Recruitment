import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

import List from 'material-ui/List'

import EmailsListItem from './EmailsListItem'
import ImapAccountsList from './ImapAccountsList'

import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'

import InboxTag from '../inboxTag'

class EmailsList extends React.Component {
    constructor( props ){
        super( props );
        this.toggle;
        this.handleToggle = this.handleToggle.bind(this);
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
    }
    submitForm( evt ){
    }
    handleToggle () {
      this.toggle.handleOpen();
    }
    render(){
        let emails = this.props.inbox.emails
        let emailsList = emails.map( (email) => {
            return (
                <div key={email._id}>
                    <EmailsListItem email={email} />
                </div>
            )
        })

        let prev_page_num = this.props.inbox.previous_page
        let next_page_num = this.props.inbox.next_page

        let count_unread_emails = ""
        if( typeof this.props.inbox.count_unread_emails != 'undefined' && this.props.inbox.count_unread_emails > 0 ){
            count_unread_emails  = "(" + this.props.inbox.count_unread_emails + ")"
        }


        let prev_page_link = <li  onClick={ () => this.props.doPageChange(prev_page_num)}><span aria-hidden="true">&laquo;</span></li>
        if( prev_page_num == '' ){
            prev_page_link = <li className="disabled" onClick={ () => this.props.doPageChange(prev_page_num)} ><span aria-hidden="true">&laquo;</span></li>
        }

        let next_page_link = <li onClick={ () => this.props.doPageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        if( next_page_num == '' ){
            next_page_link = <li className="disabled" onClick={ () => this.props.doPageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        }

        return(

            <div className="row" style={{ "margin":"0px", "position" : "relative"}}>
                <div className="col-xs-2" style={{ "padding":"0px", "backgroundColor":"#fff", "height":"100%", "position":"absolute"}}>

                    <Menu desktop={true}>
                      <MenuItem  primaryText={
                            <Link to="inbox">Inbox {count_unread_emails}</Link>
                        } />
                      <MenuItem
                        children={<FlatButton
                          onTouchTap={this.handleToggle}
                          label="Add Tag"
                           />}
                        />

                    </Menu>

                    <hr/>

                    <ImapAccountsList imap_emails={this.props.imap_emails}/>


                </div>
                <div className="col-xs-10" style={{ "float":"right"}}>
                    <div style={{ "marginBottom":"50px", "marginTop":"-16px"}}>
                        <nav aria-label="Page navigation">
                            <ul className="pagination pull-right">
                                {prev_page_link}
                                {next_page_link}
                            </ul>
                        </nav>
                    </div>
                    <List>
                        {emailsList}
                    </List>
                    <InboxTag onAddTag={this.props.onAddTag} toggle={(toggle) => this.toggle = toggle}></InboxTag>
                </div>
            </div>
        );
    }
}

export default withRouter(EmailsList)

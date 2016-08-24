import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

import List from 'material-ui/List'

import EmailsListItem from './EmailsListItem'
import ImapAccountsList from './ImapAccountsList'

import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar';
import _ from 'lodash'
import verge from 'verge';

class EmailsList extends React.Component {
    constructor( props ){
        super( props );
        this.onClick = this.onClick.bind(this);
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
    }
    submitForm( evt ){
    }
    onClick ( obj ) {
      this.props.onInboxData( this.props.emails_per_page, this.props.page_num , obj.t_id);
    }
    render(){
        let emails = this.props.inbox.emails
        let emailsList = emails.map( (email) => {
            return (
                <div key={email._id}>
                    <EmailsListItem email={email}  tags={this.props.tags} onAssignTag={this.props.onAssignTag}/>
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
                <div className="col-xs-2" style={{ "padding":"0px", "backgroundColor":"#fff", "height":verge.viewportH()+200+"px", "position":"absolute",}}>

                    <Menu>
                        <MenuItem  primaryText={
                            <Link to="sendmail" style={{"padding":"0px 0px"}}>Send mail</Link>
                        }/>
                        <MenuItem  primaryText={
                            <Link to="/inbox" style={{"padding":"0px 0px"}}>Inbox {count_unread_emails}</Link>
                        }/>
                        <div >
                        {_.map(this.props.tags, (t) => (
                            <MenuItem
                            key={t._id}
                            primaryText={
                                <FlatButton
                                  icon={
                                    <Avatar
                                      backgroundColor={t.color}
                                      style={{color:"#fff"}}
                                      size={20}
                                      children={
                                        _.upperCase(t.name[0])
                                      }></Avatar>
                                  }
                                  label={t.name}
                                  ></FlatButton>
                            }
                            onTouchTap={() => this.onClick({"t_id": t._id})}
                           />

                        ))}
                      </div>
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
                </div>
            </div>
        );
    }
}

export default withRouter(EmailsList)

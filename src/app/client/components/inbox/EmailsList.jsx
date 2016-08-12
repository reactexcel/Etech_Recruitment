import React, {PropTypes} from 'react'
import { Link } from 'react-router'

<<<<<<< HEAD
import List from 'material-ui/List'

import EmailsListItem from './EmailsListItem'
import ImapAccountsList from './ImapAccountsList'

import {Menu, MenuItem} from 'material-ui/Menu'
=======
import EmailsListItem from './EmailsListItem';
>>>>>>> 3cd686149c67703951955ecd4300b41e1f6607c2

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
        if( next_page_link == '' ){
            next_page_link = <li className="disabled" onClick={ () => this.props.doPageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        }
        
        return(
<<<<<<< HEAD
            
            <div className="row" style={{ "margin":"0px", "position" : "relative"}}> 
                <div className="col-xs-2" style={{ "padding":"0px", "backgroundColor":"#fff", "height":"100%", "position":"absolute"}}>
                    
                    <Menu desktop={true}>
                      <MenuItem  primaryText={
                            <Link to="inbox">Inbox {count_unread_emails}</Link>
                        } />
                      
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
=======
            <div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="col-xs-2" >
                        </div>
                        <div className="col-xs-10" >
                            <nav aria-label="Page navigation">
                                <ul className="pagination pull-right">
                                    {prev_page_link}
                                    {next_page_link}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="col-xs-2" >
                            <div className="list-group">

                                <button type="button" className="list-group-item" style={{ 'borderRadius':'0px'}}><Link to="/inbox">Inbox</Link></button>
                            </div>
                        </div>
                        <div className="col-xs-10" >
                            <ul className="list-group">
                                {emailsList}
>>>>>>> 3cd686149c67703951955ecd4300b41e1f6607c2
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default EmailsList


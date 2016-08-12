import React, {PropTypes} from 'react'
import { Link } from 'react-router'

import EmailsListItem from './EmailsListItem';
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

        let prev_page_link = <li  onClick={ () => this.props.doPageChange(prev_page_num)}><span aria-hidden="true">&laquo;</span></li>
        if( prev_page_num == '' ){
            prev_page_link = <li className="disabled" onClick={ () => this.props.doPageChange(prev_page_num)} ><span aria-hidden="true">&laquo;</span></li>
        }

        let next_page_link = <li onClick={ () => this.props.doPageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        if( next_page_link == '' ){
            next_page_link = <li className="disabled" onClick={ () => this.props.doPageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        }

        return(
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
                                <button type="button" className="list-group-item" style={{ 'borderRadius':'0px'}} onClick={this.handleToggle}> Add Tag (<b>+</b>)</button>
                            </div>
                        </div>
                        <div className="col-xs-10" >
                            <ul className="list-group">
                                {emailsList}
                            </ul>
                        </div>
                        <InboxTag onAddTag={this.props.onAddTag} toggle={(toggle) => this.toggle = toggle}></InboxTag>
                    </div>
                </div>
            </div>
        );
    }
}
export default EmailsList

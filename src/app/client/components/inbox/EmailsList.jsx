import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import EmailsListItem from './EmailsListItem';

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
                            </div>
                        </div>
                        <div className="col-xs-10" >
                            <ul className="list-group">
                                {emailsList}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(EmailsList)


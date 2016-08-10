import React from 'react'
import { withRouter, router } from 'react-router'


class EmailListItem extends React.Component {

    constructor( props ){
        super( props );
        this.openemail = this.openemail.bind(this);
    }
    openemail(){
      this.props.router.push('emailbody/'+this.props.email._id)
    }
    render(){
      let m_from = this.props.email.from
      if( m_from.length > 25 ){
        m_from = m_from.substring(0,25)+'...'
      }

      let m_subject = this.props.email.subject
      if( m_subject.length > 70 ){
        m_subject = m_subject.substring(0,70)+'...'
      }

      let email_date = this.props.email.email_date

    	let m_source_email_id = this.props.email.m_source_email_id
		  let f_char = m_from.charAt(0)
    	f_char = f_char.toUpperCase();

      let m_read_status = this.props.email.m_read_status
      let mail_bg_color = "#fff"
      if( typeof m_read_status == 'undefined' || m_read_status == 0 ){
        mail_bg_color = "rgb(229, 226, 226)"
      }
      return(
        <li className="list-group-item" style={{ 'backgroundColor': `${mail_bg_color}`, 'borderRadius':'0px'}}>
          <div className="row">
            <div className="col-xs-2" onClick={this.openemail} >
              <b>{ m_from }</b>
            </div>
            <div className="col-xs-5">
              {m_subject}
            </div>
            <div className="col-xs-3">

            </div>
            <div className="col-xs-2 pull-right text-right">
              {email_date}
            </div>
          </div>
          
        </li>
      );
    }
}

export default withRouter(EmailListItem)
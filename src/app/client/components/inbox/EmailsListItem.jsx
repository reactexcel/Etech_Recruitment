import React from 'react'

class EmailListItem extends React.Component {

    constructor( props ){
        super( props );
    }
    render(){
       let m_id = this.props.email._id
      let m_link = '/emailbody/' + m_id
      
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

      let hasAttachment = <span>&nbsp;</span>

      if( typeof this.props.email.attachments != 'undefined' && this.props.email.attachments.length > 0 ){
        hasAttachment = <EditorAttachFile style={{"marginRight":"2%","marginTop":"20px"}} />
      }

      //--more emails
      let more_emails = []
      let more_emails_count = 0
      if( typeof this.props.email.more_emails != 'undefined' ){
        more_emails = this.props.email.more_emails
        more_emails_count = more_emails.length
      }
      let show_more_email_count = ""
      if( more_emails_count > 0 ){
        show_more_email_count = "("+more_emails_count+")"
      }
      
      return(

          <div key={this.props.email._id}  style={{ "backgroundColor": `${mail_bg_color}`}} >

            <Link to={m_link}>

              <ListItem
                leftAvatar={avatar}
                rightIconButton={hasAttachment}
                primaryText={
                  <p>
                    <b>
                      {m_subject} 
                    </b>
                    <i style={{"fontSize": "12px"}}>
                      &nbsp;&nbsp;<span style={{color: darkBlack}}></span>&nbsp;&nbsp;{email_date}
                    </i>
                  </p>
                }
                secondaryText={
                  <p>
                    <i><b> {m_source_email_id} </b></i> - From {m_from} &nbsp; <b>{show_more_email_count}</b>
                  </p>
                }
                secondaryTextLines={2}
              />
              </Link>
            <Divider inset={true} />

          </div>
          
        
      );
    }
}

export default EmailListItem

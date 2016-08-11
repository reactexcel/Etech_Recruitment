import React from 'react'

import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'

import FontIcon from 'material-ui/FontIcon';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack, greenA700, red200} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file'

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
      let mail_left_border_color = "#C6F7C6"
      if( typeof m_read_status == 'undefined' || m_read_status == 1 ){
        mail_bg_color = "rgb(229, 226, 226)"
        mail_left_border_color = "#F3C6C6"
      }

      let m_body = this.props.email.body


      let avatar1 = <Avatar backgroundColor={mail_left_border_color} color={darkBlack} style={{ "marginTop":"50%", "marginLeft":"30%"}} >{f_char}</Avatar>
      let avatar = <div style={{ "borderLeft":`5px solid ${mail_left_border_color}`,'height' : '100%', 'left' : '0px',"top":"0px"}}>{avatar1}</div>

      //----
      let primaryText = m_subject + ' - <i>' + email_date +'</i>'

      let body_text = <span dangerouslySetInnerHTML={{__html: m_body }}></span>

      if( body_text.length > 100 ){
        body_text = body_text.substring(0,100)+'...'
      }

      let hasAttachment = <span>&nbsp;</span>

      if( typeof this.props.email.attachments != 'undefined' && this.props.email.attachments.length > 0 ){
        hasAttachment = <EditorAttachFile style={{"marginRight":"2%","marginTop":"20px"}} />
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
                    <i><b> {m_source_email_id} </b></i> - From {m_from}
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
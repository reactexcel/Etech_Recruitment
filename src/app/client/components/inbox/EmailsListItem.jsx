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
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file';
import Checkbox from 'material-ui/Checkbox';
import TagMenu from '../../components/tagMenu';
import _ from 'lodash';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import ActionDone from 'material-ui/svg-icons/action/done';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';

class EmailListItem extends React.Component {

    constructor( props ){
        super( props );
        this.state={
      msgOpen:false,
      msg:'',
    }
      this.AssignTag = this.AssignTag.bind( this )
    }
    componentWillMount( props ){

    }
    AssignTag(m_id, t_id){
      this.props.onAssignTag(m_id, t_id).then((data)=>{
      this.setState({
        msgOpen:true,
        msg:'Tag Assigned',
      })
    }).catch((err)=>{
      this.setState({
        msgOpen:true,
        msg:err.toString(),
      })
    })
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

      let m_read_status = this.props.email.unread
      let mail_bg_color = "#fff"
      let mail_left_border_color = "#C6F7C6"
      let unread_color = '#000000'
      if( m_read_status == false ){
        unread_color = '#808080'
      }

      let m_body = this.props.email.body


      _.map(this.props.tags,(t) =>{
        if(typeof this.props.inbox.tag != '')
          if(t._id == this.props.inbox.tag )
            mail_left_border_color = t.color;
      })
      let avatar1 = <Avatar backgroundColor={mail_left_border_color} color={darkBlack} style={{"position":'absolute', marginTop:"-30%", marginLeft:"-40%"}} >{f_char}</Avatar>

      //----
      let primaryText = m_subject + ' - <i>' + email_date +'</i>'

      let body_text = <span dangerouslySetInnerHTML={{__html: m_body }}></span>

      if( body_text.length > 100 ){
        body_text = body_text.substring(0,100)+'...'
      }

      let hasAttachment = <span>&nbsp;</span>

      if( typeof this.props.email.attachments != 'undefined' && this.props.email.attachments.length > 0 ){
        hasAttachment = <EditorAttachFile style={{"marginRight":"3%","marginTop":"20px"}} />
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
      //----progress status
      let progresColor = '#038503';
      let progresStatus = typeof this.props.email.progresStatus !== 'undefined'?this.props.email.progresStatus:0
      return(

          <div key={this.props.email._id}  style={{ "marginBottom":"0px"}} >
              <ListItem
                style={{"marginBottom":"0px","marginBottom":"4px", borderLeft:"5px solid "+mail_left_border_color , paddingBottom:"0px",  "backgroundColor": `${mail_bg_color}`}}
                rightIcon={hasAttachment}
                rightIconButton={
                  <div style={{left:"95%","top":"2%"}}>
                    <TagMenu AssignTag={this.AssignTag} {...this.props}/>
                  </div>
                }
                leftCheckbox={
                  <Checkbox
                    style={{"marginTop":'1%'}}
                    uncheckedIcon={avatar1}
                    checkedIcon={<Avatar backgroundColor={mail_left_border_color} color={darkBlack} children={<ActionDone />} style={{"position":'absolute', marginTop:"-30%", marginLeft:"-40%"}} />}
                    onCheck={(e, check)=>{
                      if(check==true){
                        this.props.addEmailId()
                      }else{
                        this.props.removeEmailId()
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                primaryText={
                  <p style={{color:unread_color}}>
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
                    {progresStatus!==0?<LinearProgress color={progresColor} mode="determinate" value={progresStatus} min={0} max={100} style={{marginTop:'7px'}}/>:''}
                  </p>

                }
                secondaryTextLines={2}
                onClick={() => this.props.router.push(m_link)}
              />

              <Snackbar
                    open={this.state.msgOpen}
                    message={this.state.msg}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                  />
          </div>

      );
    }
}

export default EmailListItem

import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
const classNames = require('classnames');
import List from 'material-ui/List'

import EmailsListItem from './EmailsListItem'
import ImapAccountsList from './ImapAccountsList'
import Dialog from 'material-ui/Dialog';
import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash'
import verge from 'verge';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader'

class EmailsList extends React.Component {
    constructor( props ){
        super( props );
        this.state={
          emailIdList:[],
          ignoreTagId:'',
          rejectTagId:'',
          rejectpop:false,
          errortxt:'',
        }
        this.onClick = this.onClick.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.updateEmailIdList= this.updateEmailIdList.bind(this);
        this.submitreason=this.submitreason.bind(this);
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
        _.map(props.inboxTag,(tag)=>{
            if(tag.name=="Ignore"){
               this.setState({
                 ignoreTagId:tag._id
               })
            }
            if(tag.name=="Reject"){
              this.setState({
                 rejectTagId:tag._id
              })
            }
         })
    }
    submitForm( evt ){
    }

    handleClose(){
      this.setState({rejectpop: false});
    }
    submitreason(idList){
    let reason = this.refs.reg.input.value.trim()
    if(reason.length > 0){
        this.props.onRejectMultipleCandidate(idList,this.state.rejectTagId,reason)
        this.handleClose()
    }else{
        this.setState({
            errortxt:'Reason required'
        })
    }
  }
    onClick ( obj ) {
      this.props.onInboxData( this.props.emails_per_page, this.props.page_num , obj.t_id);
    }
    updateEmailIdList(emailId,check){
        if(check==true){
            this.state.emailIdList.push(emailId)
            this.setState({
                emailIdList : this.state.emailIdList
            })
        }else{
            _.pull(this.state.emailIdList,emailId)
            this.setState({
                emailIdList:this.state.emailIdList
            })
        }

        if(this.state.emailIdList.length>0){
          this.refs.actionList.className = classNames("pagination","pull-left","show");
        }else{
          this.refs.actionList.className = classNames("pagination","pull-left","hidden");
        }

    }
    render(){
        let emails = this.props.inbox.emails
        let emailsList = emails.map( (email) => {
            return (
                <div key={email._id}>

                    <EmailsListItem email={email} addEmailId={()=>{this.updateEmailIdList(email._id,true)}} removeEmailId={()=>{this.updateEmailIdList(email._id,false)}} tags={this.props.tags} onAssignTag={this.props.onAssignTag} router={this.props.router}/>
                </div>
            )
        })


        const actions = [
          <FlatButton
           label="Cancel"
           primary={true}
           onTouchTap={this.handleClose}
          />,
          <FlatButton
           label="Submit"
           primary={true}
           onTouchTap={()=>{this.submitreason(this.state.emailIdList)}}
          />,
    ];

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
                <div className="col-xs-2 col-sm-2 " style={{ "padding":"0px", "backgroundColor":"#fff", "height":emails.length == 0?verge.viewportH()+200+"px":"100%",}}>

                    <Menu>

                      {this.props.tags.length === 0 ?
                        <div style={{'marginLeft':"10%"}}>
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"150px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"130px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"160px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                        </div>
                        :<div >
                        <MenuItem  primaryText={
                            <Link to="sendmail" style={{"padding":"0px 0px"}}>Send mail</Link>
                        }/>
                        <MenuItem  primaryText={
                            <Link to="/inbox" style={{"padding":"0px 0px"}}>Inbox {count_unread_emails}</Link>
                        }/>
                      <Subheader>Tags</Subheader>
                        {_.map(this.props.tags, (t) => {
                          let unread_mail = 0;
                          _.forEach(emails, (email) => {
                            if(_.indexOf(email.tags,t._id) >= 0 && email.m_read_status == 0)
                              ++unread_mail;
                          })
                        return <MenuItem
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
                                  label={t.name + " ("+ unread_mail+")"}
                                  ></FlatButton>
                            }
                            onTouchTap={(e) => this.onClick({"t_id": t._id}, e)}
                           />
                       })}
                     </div>}
                    </Menu>

                    <hr/>
                      {emails.length === 0?
                        <div style={{'marginLeft':"10%"}}>
                            <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"150px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                            <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"110px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                        </div>
                        :
                        <ImapAccountsList {...this.props}/>
                      }


                </div>
                <div className="col-xs-10 col-sm-10">
                  <div className="row">
                    <div className="col-xs-12" >
                        <nav aria-label="Page navigation">
                            <ul ref="actionList" className="pagination pull-left hidden">
                             <li style={{cursor:'pointer'}} onClick={ () => {
                                   this.props.onIgnoreMultipleCandidate(this.state.emailIdList,this.state.ignoreTagId);
                             }}><span aria-hidden="true" >Ignore</span></li>
                             <li style={{cursor:'pointer'}} onClick={ () => {
                                   this.setState({rejectpop:true})
                             }}><span aria-hidden="true" >Reject</span></li>
                             <li style={{cursor:'pointer'}}><span aria-hidden="true" >Schedule</span></li>
                            </ul>
                            {      }
                            <ul className="pagination pull-right">
                              <li className="disabled"><span aria-hidden="true">Page no: {next_page_num === ''?1:next_page_num-1}</span></li>
                                {prev_page_link}
                                {next_page_link}
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="row">
                  <div className=" col-sm-12 col-xs-12" style={{"marginTop":"-20px"}}>
                    <Dialog
                     title="Give the reason of rejection"
                     actions={actions}
                     modal={false}
                     open={this.state.rejectpop}
                     onRequestClose={this.handleClose}
                    >
                    <div>
                    <TextField
                     style={{width: '100%'}}
                     ref='reg'
                     errorText={this.state.errortxt}
                     floatingLabelText="Reason to reject"
                     />
                     </div>
                    </Dialog>
                    {emails.length === 0?
                      <div style={{position:'relative', width:"100%",textAlign:"center"}}>
                        <div>
                          <CircularProgress size={1.5} />
                        </div>
                        <div className="text-center" style={{color:'lightgray',textAlign:"center"}}><h4>Loading please wait ... </h4></div>
                      </div>
                      :
                      <List>
                        {emailsList}
                      </List>
                    }
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

export default withRouter(EmailsList)

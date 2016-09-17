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
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash'
import verge from 'verge';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import ScheduleCandidate from './ScheduleCandidate'
import Subheader from 'material-ui/Subheader'
import DefaultPage from './defaultPage'

class EmailsList extends React.Component {
    constructor( props ){
        super( props );
        this.state={
          emailIdList:[],
          ignoreTagId:'',
          rejectTagId:'',
          scheduleTagId:'',
          rejectpop:false,
          schedulePop:false,
          scheduledDate:moment().format("DD-MM-YYYY"),
          scheduledTime:moment().format("hh:mm:ss a"),
          errortxt:'',
          SnackbarOpen:false,
          SnackbarMessage:''
        }
        this.onClick = this.onClick.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.updateEmailIdList= this.updateEmailIdList.bind(this);
        this.submitreason=this.submitreason.bind(this);
        this.submitMail=this.submitMail.bind(this);
        this.tagName = '';
        this.tagColor = '';
        this.selectedTag = '';
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
        _.map(props.tags,(tag)=>{
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
            if(tag.name=="Schedule"){
              this.setState({
                 scheduleTagId:tag._id
              })
            }
         })
    }
    submitForm( evt ){
    }

    handleClose(){
      this.setState({rejectpop: false});
    }
    handleRequestClose = () => {
    this.setState({
      SnackbarOpen: false,
    });
  };
    submitreason(idList){
    let reason = this.refs.reg.input.value.trim()
    if(reason.length > 0){
        this.props.onRejectMultipleCandidate(idList,this.state.rejectTagId,reason).then(()=>{
          this.handleClose()
          this.setState({
            "SnackbarMessage":"Candidates are rejected",
            "SnackbarOpen":true,
            "emailIdList":[]
          })
          this.refs.actionList.className = classNames("pagination","pull-left","hidden");
        }).catch((err)=>{
          this.setState({
            "SnackbarMessage":err.toString(),
            "SnackbarOpen":true
          })
        })
    }else{
        this.setState({
            errortxt:'Reason required'
        })
    }
  }
    submitMail(idList){
      if(this.state.scheduledDate==''){

      }
      this.handleClose()
    }
    onClick ( obj ) {
      this.tagName = obj.t_name;
      this.tagColor = obj.t_color;
      this.selectedTag = obj.t_id;
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
        let tag = this.props.inbox.tag
        let emails = this.props.inbox.emails
        let emailsList
        let email = '';
        _.forEach(this.props.emailSetting, ( e ) =>{
          if(e._id == tag){
            email = e.emailId;
          }
        })
        if(tag !== ''){
          emailsList = _.map(emails, (email) => {
          if(_.includes(email.tags, tag) || (email !== '' )){
            return (
                <div key={email._id}>
                    <EmailsListItem email={email} addEmailId={()=>{this.updateEmailIdList(email._id,true)}} removeEmailId={()=>{this.updateEmailIdList(email._id,false)}}
                      {...this.props}
                      />
                </div>
            )
          }
        })
        }else{
          emailsList = _.map(emails, (email) => {
          if(_.isEmpty(email.tags)){
            return (
                <div key={email._id}>
                    <EmailsListItem email={email} addEmailId={()=>{this.updateEmailIdList(email._id,true)}} removeEmailId={()=>{this.updateEmailIdList(email._id,false)}}
                      {...this.props}/>
                </div>
            )
          }
        })
        }


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
                <div className="col-xs-3 col-sm-3 " style={{ "padding":"0px", "backgroundColor":"#fff",width:'21%', "height":emails.length == 0?verge.viewportH()+200+"px":"100%",}}>

                    <Menu>

                      {this.props.tags.length === 0 ?
                        <div style={{'marginLeft':"10%"}}>
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"150px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"130px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"160px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                        </div>
                        :<div >
                        <MenuItem  primaryText={
                              <FlatButton
                                style={{ backgroundColor: 'transparent'}}
                                label={'Inbox ' + count_unread_emails}
                                onTouchTap= { () => this.onClick( {t_id : ''}) }
                                ></FlatButton>
                        }/>


                       {
                        _.map(this.props.tags, (t) => {
                          let unread_mail = 0;
                          let total_mail = 0;
                          _.forEach(this.props.inbox.tagList, (list) => {
                            if(list.tagId == t._id){
                               unread_mail=list.count
                               total_mail=list.total
                            }
                          })
                          return <MenuItem
                            key={t._id}
                            primaryText={
                                <FlatButton
                                  style={{textDecoration: this.selectedTag == t._id?'underline':'none',backgroundColor: 'transparent'}}
                                  icon={
                                    <Avatar
                                      backgroundColor={t.color}
                                      style={{color:"#fff"}}
                                      size={20}
                                      children={
                                        _.upperCase(_.trim(t.name)[0])
                                      }></Avatar>
                                  }
                                  label={_.trim(t.name) + " ("+ unread_mail+"/"+total_mail+")"}
                                  ></FlatButton>
                            }
                            onTouchTap={(e) => this.onClick({"t_id": t._id, t_name: t.name, t_color: t.color}, e)}
                           />
                        })
                       }
                     </div>}
                    </Menu>

                </div>
                <div className="col-xs-9 col-sm-9" style={{width:'79%'}} >
                  <div className="row">
                    <div className="col-xs-12" >
                        <nav aria-label="Page navigation">
                            <ul ref="actionList" className="pagination pull-left hidden">
                             <li style={{cursor:'pointer'}} onClick={ () => {
                                   this.props.onIgnoreMultipleCandidate(this.state.emailIdList,this.state.ignoreTagId).then(()=>{
                                    this.setState({
                                    "SnackbarOpen":true,
                                    "SnackbarMessage":"Candidates are ignored",
                                    "emailIdList":[]
                                   })
                                   this.refs.actionList.className = classNames("pagination","pull-left","hidden");
                                  }).catch((err)=>{
                                    this.setState({
                                    "SnackbarOpen":true,
                                    "SnackbarMessage":err.toString()
                                   })
                                  })

                             }}><span aria-hidden="true" >Ignore</span></li>
                             <li style={{cursor:'pointer'}} onClick={ () => {
                                   this.setState({rejectpop:true})
                             }}><span aria-hidden="true" >Reject</span></li>
                             <li style={{cursor:'pointer'}} onClick={ () => {
                                    this.setState({schedulePop:true})
                             }}><span aria-hidden="true" >Schedule</span></li>
                            </ul>
                            {      }
                            <ul className="pagination pull-right">
                              {next_page_num !== '' && emailsList.length !== 0 ?<li className="disabled"><span aria-hidden="true">Page no: {next_page_num === ''?1:next_page_num-1}</span></li>:''}
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
                    <ScheduleCandidate
                    scheduleTagId={this.state.scheduleTagId}
                    showPopUp={this.state.schedulePop}
                    emailIdList={this.state.emailIdList}
                    emailTemplates={this.props.emailTemplates}
                    {...this.props}
                    closeDialog={()=>{
                      this.setState({
                            schedulePop : false,
                            emailIdList :[]
                      })
                      this.refs.actionList.className = classNames("pagination","pull-left","hidden");
                    }}
                    />
                  { this.props.uiLoading ?
                      <div style={{position:'relative', width:"100%",textAlign:"center"}}>
                        <div>
                          <CircularProgress size={1.5} />
                        </div>
                        <div className="text-center" style={{color:'lightgray',textAlign:"center"}}><h4>Loading please wait ... </h4></div>
                      </div>
                      :
                      (
                        emailsList.length == 0?
                          <DefaultPage name={this.tagName} color={this.tagColor}/>:
                          <List>
                            {emailsList}
                          </List>
                      )
                    }
                  </div>
                  <Snackbar
                    open={this.state.SnackbarOpen}
                    message={this.state.SnackbarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                  />
                </div>

              </div>
            </div>
        );
    }
}

export default withRouter(EmailsList)



import React, {Component,PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
const classNames = require('classnames');
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import {lightBlue200,blue500, yellow600, indigo500, pinkA200} from 'material-ui/styles/colors';
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
//import ScheduleCandidate from './ScheduleCandidate'
import Subheader from 'material-ui/Subheader'
import DefaultPage from './defaultPage'

let SelectableList = MakeSelectable(List);
function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}
SelectableList = wrapState(SelectableList);

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
          currentEmail:'',
          scheduledDate:moment().format("DD-MM-YYYY"),
          scheduledTime:moment().format("hh:mm:ss a"),
          errortxt:'',
          SnackbarOpen:false,
          SnackbarMessage:'',
          currentSection:this.props.current_sec
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
    componentWillMount( props ){
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
      if(obj.t_id==""){
        this.setState({
          currentSection:'2'
        })
      }else{
        this.setState({
          currentSection:obj.t_id
        })
      }
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
        let currentSection = this.state.currentSection
        if(currentSection == null || currentSection == ""){
          currentSection = '2'
        }
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
                    <EmailsListItem currentSection={currentSection} email={email} addEmailId={()=>{this.updateEmailIdList(email._id,true)}} removeEmailId={()=>{this.updateEmailIdList(email._id,false)}}
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
                    <EmailsListItem currentSection={currentSection} email={email} addEmailId={()=>{this.updateEmailIdList(email._id,true)}} removeEmailId={()=>{this.updateEmailIdList(email._id,false)}}
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
        let inboxItems = [<ListItem
                              value={'2'}
                              key={0}
                              primaryText={"Mails " + count_unread_emails}
                              leftIcon={<CommunicationEmail color={lightBlue200} style={{left:'7px'}}/>}
                              onTouchTap= { () => this.onClick( {t_id : ''}) }
                            />]
        let jobItems = []
        let candidateItems = []
        if(this.props.tags.length != 0){
          _.map(this.props.tags, (t,key) => {
            let unread_mail = 0;
            let total_mail = 0;
            _.forEach(this.props.inbox.tagList, (list) => {
              if(list.tagId == t._id){
                unread_mail=list.count
                total_mail=list.total
              }
            })
            if(t.automatic == undefined){
              inboxItems.push(<ListItem
                              value={t._id}
                              key={key+1}
                              primaryText={_.trim(t.name) + " ("+ unread_mail+"/"+total_mail+")"}
                              leftIcon={<Avatar
                                      backgroundColor={t.color}
                                      style={{color:"#fff",height:'29px',width:'29px',fontSize:'20px',opacity:1,display:'inline-flex'}}
                                      size={20}>
                                      <span >{_.upperCase(_.trim(t.name)[0])}</span>
                                      </Avatar>}
                              onTouchTap={(e) => this.onClick({"t_id": t._id, t_name: t.name, t_color: t.color}, e)}
                            />)
            }else if(t.automatic == true){
              jobItems.push(<ListItem
                              value={t._id}
                              key={key+1}
                              primaryText={_.trim(t.name) + " ("+ unread_mail+"/"+total_mail+")"}
                              leftIcon={<Avatar
                                      backgroundColor={t.color}
                                      style={{color:"#fff",height:'29px',width:'29px',fontSize:'20px',opacity:1,display:'inline-flex'}}
                                      size={20}>
                                      <span>{_.upperCase(_.trim(t.name)[0])}</span>
                                      </Avatar>}
                              onTouchTap={(e) => this.onClick({"t_id": t._id, t_name: t.name, t_color: t.color}, e)}
                            />)
            }else if(t.automatic == false){
              candidateItems.push(<ListItem
                              value={t._id}
                              key={key+1}
                              primaryText={_.trim(t.name) + " ("+ unread_mail+"/"+total_mail+")"}
                              leftIcon={<Avatar
                                      backgroundColor={t.color}
                                      style={{color:"#fff",height:'29px',width:'29px',fontSize:'20px',opacity:1,display:'inline-flex'}}
                                      size={20}>
                                      <span>{_.upperCase(_.trim(t.name)[0])}</span>
                                      </Avatar>}
                              onTouchTap={(e) => this.onClick({"t_id": t._id, t_name: t.name, t_color: t.color}, e)}
                            />)
            }
          })
        }
        return(
            <div className="row" style={{ "margin":"0px", "position" : "relative"}}>
                <div className="col-xs-3 col-sm-3 " style={{ "padding":"0px", "backgroundColor":"#fff",width:'21%', "height":emails.length == 0?verge.viewportH()+200+"px":"90%",'position':'fixed','top':'62px','overflowY':'scroll'}}>
                      
                        {this.props.tags.length === 0 ?
                        <div style={{'marginLeft':"10%"}}>
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"150px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"130px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                          <LinearProgress mode="indeterminate" color="#aaa" style={{"height":"9px", width:"160px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                        </div>
                        :<SelectableList desktop={true} defaultValue={currentSection}>
                          <ListItem
                          value={'1'}
                          primaryText="Inbox"
                          leftIcon={<ContentInbox />}
                          //initiallyOpen={true}
                          primaryTogglesNestedList={true}
                          nestedItems={inboxItems}
                          />
                          <ListItem
                          value={'3'}
                          primaryText="Jobs"
                          leftIcon={<ActionAssignment color={blue500}/>}
                          primaryTogglesNestedList={true}
                          nestedItems={jobItems}
                          />
                          <ListItem
                          value={'4'}
                          primaryText="Candidates"
                          leftIcon={<ContentDrafts color={pinkA200}/>}
                          primaryTogglesNestedList={true}
                          nestedItems={candidateItems}
                          />
                        </SelectableList>}
                      


                </div>
                <div className="col-xs-9 col-sm-9" style={{width:'79%','left':'21%'}} >
                  <div className="row">
                    <div className="col-xs-12" >
                      {this.props.errorMessage == "" ? "" : <div className="alert alert-danger text-center" style={{width:"100%",position:'relative',top:'12px'}}><b>{this.props.errorMessage}</b></div>}
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
                            {//  <li style={{cursor:'pointer'}} onClick={ () => {
                            //         this.setState({schedulePop:true})
                            //  }}><span aria-hidden="true" >Schedule</span></li>
                            }
                             <li style={{cursor:'pointer'}} onClick={ () => {
                               this.props.onDeleteMultipleEmails(this.state.emailIdList).then(()=>{
                                //this.props.doPageChange(next_page_num-1)
                                this.setState({
                                  "SnackbarOpen":true,
                                  "SnackbarMessage":"Mail deleted ",
                                  "emailIdList":[]
                                })
                               this.refs.actionList.className = classNames("pagination","pull-left","hidden");
                              }).catch((err)=>{
                                this.setState({
                                "SnackbarOpen":true,
                                "SnackbarMessage":err.toString()
                               })
                              })
                             }}><span aria-hidden="true" >Delete</span></li>
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

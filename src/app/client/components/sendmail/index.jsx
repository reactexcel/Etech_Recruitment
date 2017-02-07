import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import {pink100} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {lightGreenA700,indigo900,cyan100,cyan50,grey50,red700,green500,grey200,green900,pinkA200,grey900} from 'material-ui/styles/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';
const classNames = require('classnames');
import _ from 'lodash'
 import verge from 'verge';
import RichTextEditor from 'react-rte';
import ScheduleCandidate from '../inbox/ScheduleCandidate'


const style = {
  container: {
    position: 'relative',
    textAlign:'center',
    paddingTop:'200px'
  },
  refresh: {
    verticalAlign:'middle',
    display: 'inline-block',
    position: 'relative',
  },
  formInput:{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "90%"
  },
  editorStyle :{
      overflow: 'auto',
      display: 'block',
      width: '100%',
      height: '300px',
      maxHeight: '300px',
      background:'rgba(204,204,204,.51)',
    }
};

class SendEmail extends React.Component {
    constructor( props ){
        super( props );
        this.state={
            tmpid:'',
            tempName:'',
            sub:'',
            openDialog:false,
            dialogTitle:'',
            paper:'show',
            tmpid:'',
            content:RichTextEditor.createEmptyValue(),
            errName:'',
            errSub:'',
            snackbarOpen:false,
            snackbarmsg:'',
            tmppage:'row',
            tmpcreat:'hidden',
            loader:'hidden',
            openTesting:false,
            testingEmail:'',
            errTestEmail:'',
            testingName:'',
            errTestName:'',
            currentTemplate:'',
            data_to_set:{
              currentEmail:{},
              currentAction:{},
              emailIdList:[],
              emailTemplates:{}
            }
    }
        this.saveTemplate  = this.saveTemplate.bind( this )
        this.openCreatetemplate  = this.openCreatetemplate.bind( this )
        this.deleteTemplate = this.deleteTemplate.bind(this)
        this.editTemplate = this.editTemplate.bind( this )
        this.onChange = this.onChange.bind(this);
        this.validateEmailId = this.validateEmailId.bind(this)
        this.handleCloseTesting = this.handleCloseTesting.bind(this)
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        this.setState({
          loader:'show',
          paper:'hidden'
        })
        this.props.onfetchTemplate().then( (data) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:data.toString(),
          loader:'hidden',
          paper:'show'
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          loader:'hidden',
          paper:'show'
        })
      })
    }
    openCreatetemplate(){
        this.setState({
            openDialog:true,
            tmpid:'',
            content:RichTextEditor.createEmptyValue(),
        })
    }
    gotoTmppage(){
        this.setState({
            tempName:'',
            sub:'',
            errName:'',
            errSub:'',
            tmppage:'row',
            tmpcreat:'hidden',
            tmpid:'',
            content:RichTextEditor.createEmptyValue(),
            openDialog:false,
            dialogTitle:''
        })
    }
    deleteTemplate(data,evt){
    this.props.onDeleteTemplate(data._id).then( (msg) => {
      this.props.logging("Email template deleted",Meteor.userId(),"Template name : "+data.name)
        this.setState({
          snackbarOpen:true,
          snackbarmsg:msg.toString(),
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }
    editTemplate(data,evt){
        this.setState({
            openDialog:true,
            dialogTitle:'Edit Template',
            tempName:data.name,
            sub:data.subject,
            tmppage:'hidden',
            tmpcreat:'row',
            content:RichTextEditor.createValueFromString(data.content, 'html'),
            tmpid:data._id,
        })
    }

    saveTemplate() {
        let tmpid = this.state.tmpid.trim(),
            name=this.state.tempName.trim(),
            subject=this.state.sub.trim(),
            content=this.state.content.toString('html'),
            errName = "",
            errSubject = "";
            if(_.isEmpty(name)){
              errName = "Required"
            }
            if(_.isEmpty(subject)){
              errSubject = "Required"
            }
            this.setState({
              errName: errName,
              errSub: errSubject
            })
            if(!_.isEmpty(name) && !_.isEmpty(subject) && !_.isEmpty(content)){
              let template={'name':name, 'subject':subject,'content':content}
              this.props.onSaveTemplate(tmpid, template).then((succ)=>{
                this.setState({
                  snackbarOpen:true,
                  snackbarmsg:"Template saved successfully",
                })
                if(tmpid==""){
                  this.props.logging("New email template added",Meteor.userId(),"Template name : "+name)
                }else{
                  this.props.logging("Email template edited",Meteor.userId(),"Template name : "+name)
                }
                this.gotoTmppage();
              }).catch((err)=>{
                this.setState({
                  snackbarOpen:true,
                  snackbarmsg:err.toString(),
                })
              })
            }
    }
    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
    onChange(value) {
      this.setState({ content:value });
    }
    handleCloseTesting(){
      this.setState({
        openTesting:false,
        testingEmail:'',
        errTestEmail:'',
        testingName:'',
        errTestName:'',
        currentTemplate:'',
        data_to_set:{
          currentEmail:{},
          currentAction:{},
          emailIdList:[],
          emailTemplates:{}
        }
      })
    }
    validateEmailId(){
      let validateEmail = false,
          validateName = false
      let emailId = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if(!emailId.test(this.state.testingEmail)){
        this.setState({
          errTestEmail:'Invalid email id'
        })
        validateEmail = false
      }else{
        this.setState({
          errTestEmail:''
        })
        validateEmail = true
      }
      if(this.state.testingName == ""){
        this.setState({
          errTestName:'Enter candidate name'
        })
        validateName = false
      }else{
        this.setState({
          errTestName:''
        })
        validateName = true
      }
      if(validateName == true && validateEmail == true){
        let currentEmail = Object.assign({},{
          _id:this.state.testingEmail,
          sender_mail:this.state.testingEmail,
          from:this.state.testingName
        })
        let currentAction = Object.assign({},{
          template_id:this.state.currentTemplate._id,
          _id:'testingActionId'
        })
        let emailIdList = []
        emailIdList.push(currentEmail._id)
        let emailTemplates = this.props.emailTemplates
        let data_to_set = Object.assign({},{
          currentEmail:currentEmail,
          currentAction:currentAction,
          emailIdList:emailIdList,
          emailTemplates:emailTemplates
        })
        this.setState({
          data_to_set:data_to_set
        })
      }
    }
    render(){
      let data_to_set = this.state.data_to_set
      const actions = [
      <FlatButton
              label="BACK"
              primary={true}
              onTouchTap={this.gotoTmppage.bind(this)}
              style={{marginRight:5}}
            />,
            <RaisedButton
              label={_.isEmpty(this.state.tmpid) ? "SAVE" : "Update"}
              primary={true}
              onClick={this.saveTemplate}
            />,
    ];
        let count_unread_emails = ""
        if( typeof this.props.inbox.count_unread_emails != 'undefined' && this.props.inbox.count_unread_emails > 0 ){
            count_unread_emails  = "(" + this.props.inbox.count_unread_emails + ")"
        }
        return(
                <div className="col-md-12 col-xs-12 col-sm-12" style={{ "float":"right"}}>
                <Dialog
                  title={_.isEmpty(this.state.tmpid) ? "Create Template" : "Edit Template"}
                  actions={actions}
                  modal={false}
                  bodyStyle={{minHeight:'70vh'}}
                  open={this.state.openDialog}
                  onRequestClose={this.gotoTmppage.bind(this)}
                  autoScrollBodyContent={true}
                  contentStyle={{maxWidth:'90%',width:"90%",transform: 'translate(0px, 0px)'}}
                >
                <div className="col-xs-9" style={{borderRight:'1px solid gainsboro'}}>
                  <form className="form-inline">
                    <div className="form-group" style={style.formInput}>
                      <TextField
                        ref='Name'
                        floatingLabelText="Template Name"
                        hintText="Template Name"
                        fullWidth={true}
                        errorText={this.state.errName}
                        floatingLabelFixed={true}
                        value={this.state.tempName}
                        onChange={(e)=>{
                          this.setState({
                            tempName: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="form-group" style={style.formInput}>
                      <TextField
                        ref='subject'
                        floatingLabelText="Subject"
                        fullWidth={true}
                        hintText="Subject"
                        errorText={this.state.errSub}
                        floatingLabelFixed={true}
                        value={this.state.sub}
                        onChange={(e)=>{
                          this.setState({
                            sub: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div style={style.formInput}>
                      <RichTextEditor
                        style={style.editorStyle}
                        value={this.state.content}
                        onChange={this.onChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="col-xs-3" style={{'alignContent':'center'}}>
                  <List style={{'marginTop':'3%','marginRight':'2%','marginLeft':'2%','alignContent':'center'}}>
                    <Subheader style={{textAlign:'center','backgroundColor':'#00E5FF'}}>System Variables</Subheader>
                    <Divider />
                {this.props.variables.length > 0?_.map(this.props.variables, (vari,k) => {
                  if(vari.variable_type === 'system'){
                    return(
                    <div key={vari.k}>
                      <ListItem
                        primaryText={vari.varCode}
                        style={{'backgroundColor':'#E0F7FA'}}
                      />
                      <Divider />
                    </div>)
                  }
                  }):""}
                  </List>
                  <List style={{'marginTop':'3%','marginRight':'2%','marginLeft':'2%','alignContent':'center'}}>
                    <Subheader style={{textAlign:'center','backgroundColor':'#00E5FF'}}>User Variables</Subheader>
                    <Divider />
                {this.props.variables.length > 0?_.map(this.props.variables, (vari,k) => {
                  if(vari.variable_type === 'user'){
                    return(
                    <div key={vari.k}>
                      <ListItem
                        primaryText={vari.varCode}
                        style={{'backgroundColor':'#E0F7FA'}}
                      />
                      <Divider />
                    </div>)
                  }
                  }):""}
                  </List>
                </div>
                </Dialog>
                <Dialog
                  title="Enter Email Id"
                  actions={[<FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={this.handleCloseTesting}
                    />,
                  <FlatButton
                    label="Ok"
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={()=>{this.validateEmailId()}}
                  />]}
                  modal={false}
                  open={this.state.openTesting}
                  onRequestClose={this.handleCloseTesting}
                >
                <TextField
                  ref='Email'
                  floatingLabelText="Candidate Email Id"
                  hintText="Enter Email Id"
                  fullWidth={true}
                  errorText={this.state.errTestEmail}
                  floatingLabelFixed={true}
                  value={this.state.testingEmail}
                  onChange={(e)=>{
                    this.setState({
                      testingEmail: e.target.value,
                    });
                  }}
                />
                <TextField
                  ref='Name'
                  floatingLabelText="Candidate Name"
                  hintText="Enter Name"
                  fullWidth={true}
                  errorText={this.state.errTestName}
                  floatingLabelFixed={true}
                  value={this.state.testingName}
                  onChange={(e)=>{
                    this.setState({
                      testingName: e.target.value,
                    });
                  }}
                />
                </Dialog>
                <ScheduleCandidate
                  currentEmail={data_to_set.currentEmail}
                  currentAction={data_to_set.currentAction}
                  emailIdList={data_to_set.emailIdList}
                  emailTemplates={data_to_set.emailTemplates}
                  closeDialog={()=>{this.handleCloseTesting}}
                  testing={true}
                  {...this.props}
                />  
                  <div className={this.state.tmppage} style={{margin:'0px 4px 0px'}}>
                    <div className="col-xs-12">
                      <div className='row'>
                        <div className='col-xs-12' style={{paddingTop:'10px',paddingRight:'0px'}}>
                          <RaisedButton
                            style={{float:'right',margin:'0px'}}
                            label='Add New Template'
                            onClick={this.openCreatetemplate}
                            primary={true}
                            ></RaisedButton>
                        </div>
                        <div className={this.state.loader} style={style.container}>
                          <CircularProgress size={1.5} />
                        </div>
                        <div className={this.state.paper} style={{"marginTop":"8%"}}>
                          {_.map(this.props.emailTemplates,(data,key)=>{
                            return <div className="col-xs-6" key={data._id} style={{marginBottom:'20px'}}>
                            <Card style={{'marginBottom':'10px'}}>
                            <Paper
                              style={{marginTop:"5px",paddingBottom: "0px"}}
                              actAsExpander={true}
                              zDepth={1}
                              children={<CardHeader
                              title={data.name}
                              subtitle={"Subject: "+data.subject}
                              actAsExpander={true}
                              showExpandableButton={true}
                              style={{'backgroundColor':cyan100}}
                              />}
                            />
                            <CardText expandable={true}>
                              {<div className="col-xs-12 m-b"><span style={{display: 'inline-flex'}}><b>Body: </b><div className="p-l" dangerouslySetInnerHTML={{__html:data.content}}></div></span></div>}
                            </CardText>
                            <CardActions style={{'textAlign':'right'}}>
                              <FlatButton 
                                labelColor={grey900} 
                                label="Test" 
                                labelPosition="before" 
                                icon={<CommunicationEmail color={indigo900}/>} 
                                style={{'margin':2,'padding':-1}}
                                onTouchTap={(evt) => {this.setState({openTesting:true,currentTemplate:data})}}
                              />
                              <FlatButton 
                                labelColor={grey900} 
                                label="Edit" 
                                labelPosition="before" 
                                icon={<Edit color={lightGreenA700}/>} 
                                style={{'margin':2,'padding':-1}}
                                onTouchTap={(evt) => this.editTemplate(data, evt)}
                              />
                              <FlatButton 
                                labelColor={pinkA200} 
                                label="Delete" 
                                labelPosition="before" 
                                icon={<Delete color={pinkA200}/>} 
                                style={{'margin':2,'padding':-1}}
                                onTouchTap={(evt) => this.deleteTemplate(data,evt)}
                              />
                            </CardActions>
                            </Card>
                            </div>
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarmsg}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                  />
                </div>
        );
    }
}

export default withRouter(SendEmail)

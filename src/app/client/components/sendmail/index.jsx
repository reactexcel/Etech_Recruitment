import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

// import List from 'material-ui/List'
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import {pink100} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
const classNames = require('classnames');
import _ from 'lodash'
 import verge from 'verge';
// //import EditableDiv from 'react-wysiwyg-editor';
// import FroalaEditor from 'react-froala-editor';
// //import ReactQuill from 'react-quill';
// //var ReactQuill = require('react-quill');
// //import CkEditor from 'ckeditor';
// import {Editor, EditorState} from 'draft-js';
import MyEditor from './editor'


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
    "marginLeft": "0%",
    "marginRight": "0%",
    //"width": "50%"
  },
};

class SendEmail extends React.Component {
    constructor( props ){
        super( props );
        this.state={
            tempName:'',
            sub:'',
            openDialog:false,
            dialogTitle:'',
            paper:'show',
            tmpid:'',
            content:'',
            errName:'',
            errSub:'',
            snackbarOpen:false,
            snackbarmsg:'',
            tmppage:'row',
            tmpcreat:'hidden',
            loader:'hidden',
    }
        this.saveTemplate  = this.saveTemplate.bind( this )
        this.openCreatetemplate  = this.openCreatetemplate.bind( this )
        this.deleteTemplate = this.deleteTemplate.bind(this)
        this.editTemplate = this.editTemplate.bind( this )
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
            tempName:'',
            sub:'',
            tmppage:'hidden',
            tmpcreat:'row',
            openDialog:true,
            dialogTitle:'Create Template',
            content:''
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
            content:'',
            openDialog:false,
            dialogTitle:''
        })
    }
    deleteTemplate(data){
    this.props.onDeleteTemplate(data._id).then( (msg) => {console.log(msg)
      this.props.logging("Email template deleted",Meteor.userId(),"Template name : "+data.name)
        this.setState({
          snackbarOpen:true,
          snackbarmsg:msg.toString(),
        })
      }).catch( (error) => {console.log(error,'error')
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }
    editTemplate(data,evt){
      console.log(data,"editttttt")
        this.setState({
            openDialog:true,
            dialogTitle:'Edit Template',
            tempName:data.name,
            sub:data.subject,
            tmppage:'hidden',
            tmpcreat:'row',
            content:data.content,
            tmpid:data._id,
        })
    }

    saveTemplate() {
        let name=this.state.tempName.trim()
        let subject=this.state.sub.trim()
        let content=this.state.content
        let actualContent=[]
        actualContent=content.match(/#{1}[a-zA-Z_]+/ig)
        _.map(actualContent,(val)=>{
          actualContent[val]=val.toLowerCase()
        })
        _.map(actualContent,(val)=>{
          content=_.replace(content, val, actualContent[val]);
        })
        console.log(content,"actual content----------")
        let id=this.state.tmpid
        if(name!=''){
            this.setState({errName:''})
        }else{
            this.setState({errName:'Required'})
        }
        if(subject!=''){
            this.setState({errSub:''})
        }else{
            this.setState({errSub:'Required'})
        }
        if(name!='' && subject!=''){
            let template={name:name, subject:subject,content:content}
            this.props.onSaveTemplate(id, template).then( () => {
        this.setState({
          tempName:'',
          sub:'',
          content:'',
          snackbarOpen:true,
          snackbarmsg:"Template saved successfully",
        })
        if(id==""){
            this.props.logging("New email template added",Meteor.userId(),"Template name : "+name)
        }else{
            this.props.logging("Email template edited",Meteor.userId(),"Template name : "+name)
        }
        this.gotoTmppage()
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
        }
    }
    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
    render(){
      const actions = [
      <FlatButton
              label="BACK"
              primary={true}
              onTouchTap={this.gotoTmppage.bind(this)}
              style={{marginRight:5}}
            />,
            <RaisedButton
              label="SAVE"
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
                  title={this.state.dialogTitle}
                  actions={actions}
                  modal={false}
                  open={this.state.openDialog}
                  onRequestClose={this.gotoTmppage.bind(this)}
                  autoScrollBodyContent={true}
                  contentStyle={{'width':'90%','maxWidth':'none'}}
                >
                <div className="row">
                <div className="col-md-7 col-xs-7 col-sm-7">
                 <div style={style.formInput}>
                  <TextField
                            ref='Name'
                            floatingLabelText="Template Name"
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
               <div style={style.formInput}>
                  <TextField
                            ref='subject'
                            floatingLabelText="Subject"
                            fullWidth={true}
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
                  <MyEditor data={this.state.content} content={(mail)=>{
                              this.setState({content:mail})
                            }}/>
               </div>
               </div>
               <div className="col-md-5 col-xs-5 col-sm-5" style={{'alignContent':'center'}}>
               
                <List style={{'marginTop':'3%','marginRight':'2%','marginLeft':'2%','alignContent':'center'}}>
                <Subheader style={{'backgroundColor':'#00E5FF'}}>Email Template Variables</Subheader>
                <Divider />
                <ListItem
                  primaryText="#candidate_name"
                  style={{'backgroundColor':'#E0F7FA'}}
                />
                <Divider />
                 <ListItem
                  primaryText="#candidate_email"
                  style={{'backgroundColor':'#E0F7FA'}}
                />
                <Divider />
                 <ListItem
                  primaryText="#current_date"
                  style={{'backgroundColor':'#E0F7FA'}}
                />
                <Divider />
                <ListItem
                  primaryText="#schedule_date"
                  style={{'backgroundColor':'#E0F7FA'}}
                />
                <Divider />
                <ListItem
                  primaryText="#schedule_time"
                  style={{'backgroundColor':'#E0F7FA'}}
                />
                <Divider />
                {this.props.variables.length > 0?_.map(this.props.variables, (vari) => (
                  <div>
                          <ListItem
                            primaryText={vari.varCode}
                            style={{'backgroundColor':'#E0F7FA'}}
                          />
                          <Divider />
                          </div>
                          )):""}
                </List>
               </div>
                </div>
                </Dialog>
                    
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
                        <Paper  zDepth={2} style={{"padding": "1%"}}>
              <h4 className="h4">Template(s)</h4>
              <Divider />
              <div style={
                {
                  "marginTop": "2%",
                  display: 'flex',
                  flexWrap: 'wrap',
                }
              }>
                {_.map(this.props.emailTemplates, (data, key) => {
                  return  <Chip
                      key={data._id}
                      backgroundColor={pink100}
                      onRequestDelete={(evt) => {
                        evt.stopPropagation();
                        this.deleteTemplate(data)
                      }}
                      onTouchTap={(evt) => this.editTemplate(data, evt)}
                      style={{ margin: 4}}>
                      <Avatar
                        backgroundColor={pink100}
                        children={
                          _.upperCase(_.trim(data.name)[0])
                        }
                        >
                      </Avatar>
                      {data.name}
                    </Chip>
                  })}
              </div>
            </Paper>
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

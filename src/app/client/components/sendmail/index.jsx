import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

// import List from 'material-ui/List'
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
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
};

class SendEmail extends React.Component {
    constructor( props ){
        super( props );
        this.state={
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
        this.setState({loader:'show'})
        this.props.onfetchTemplate().then( (data) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:data.toString(),
          loader:'hidden',
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          loader:'hidden',
        })
      })
    }
    openCreatetemplate(){
        this.setState({
            tmppage:'hidden',
            tmpcreat:'row',
        })
    }
    gotoTmppage(){
        this.refs.Name.input.value='';
        this.refs.subject.input.value='';
        this.setState({
            tmppage:'row',
            tmpcreat:'hidden',
            tmpid:'',
            content:'',
        })
    }
    deleteTemplate(id){
    this.props.onDeleteTemplate(id).then( () => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:"Template Deleted successfully",
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }
    editTemplate(data){
        this.refs.Name.input.value=data.name;
        this.refs.subject.input.value=data.subject;
        this.setState({
            tmppage:'hidden',
            tmpcreat:'row',
            content:data.content,
            tmpid:data._id
        })
    }
    saveTemplate() {
        let name=this.refs.Name.input.value.trim()
        let subject=this.refs.subject.input.value.trim()
        let content=this.state.content
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
                this.refs.Name.input.value=''
                this.refs.subject.input.value=''
        this.setState({
            content:'',
          snackbarOpen:true,
          snackbarmsg:"Template saved successfully",
        })
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
        let count_unread_emails = ""
        if( typeof this.props.inbox.count_unread_emails != 'undefined' && this.props.inbox.count_unread_emails > 0 ){
            count_unread_emails  = "(" + this.props.inbox.count_unread_emails + ")"
        }
         let templates=[];
        _.map(this.props.emailTemplates,(data, key)=>{
            templates.push(<div className='col-xs-12' key={key}>
                    <div style={{border:'1px solid gray',borderRadius:'5px', height:'auto',margin:'10px',padding:'10px',background: '#fff',}}>
                    <div style={{textAlign:'center',color:'brown',fontWeight:'600',cursor:'pointer',fontSize:'16px'}}>Template #{key+1}</div>
                    <hr />  
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Template Name : </span>{data.name}</div>
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Subject : </span>{data.subject}</div>
                    <div style={{textAlign:'right'}}>
                    <FlatButton
                    style={{margin:'0px'}}
                    label='Edit'
                    onClick={()=>{this.editTemplate(data)}}
                    primary={true} 
                    ></FlatButton>
                    <FlatButton
                    style={{margin:'0px'}}
                    label='Delete'
                    onClick={()=>{this.deleteTemplate(data._id)}}
                    primary={true} 
                    ></FlatButton>
                    </div>
                    </div>
                </div>)
        })
        return(
            <div className="row" style={{ "margin":"0px", "position" : "relative"}}>
                <div className="col-xs-2" style={{ "padding":"0px", "backgroundColor":"#fff", "height":verge.viewportH()+200+"px", "position":"absolute",}}>
                    <Menu>
                        <MenuItem  primaryText={
                            <Link to="sendmail" style={{"padding":"0px 0px"}}>Send mail</Link>
                        }/>
                        <MenuItem  primaryText={
                            <Link to="/inbox" style={{"padding":"0px 0px"}}>Inbox {count_unread_emails}</Link>
                        }/>
                        <div >
                        {_.map(this.props.tags, (t) => (
                            <MenuItem
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
                                  label={t.name}
                                  ></FlatButton>
                            }
                            onTouchTap={() => this.onClick({"t_id": t._id})}
                           />
                        ))}
                      </div>
                    </Menu>
                    <hr/>
                </div>
                <div className="col-xs-10" style={{ "float":"right"}}>
                    <div className={this.state.tmpcreat} style={{margin:'40px 4px 0px'}}>
                    <div className="col-xs-12">
            <div className='row' style={{background: '#fff'}}>
                <div className="col-xs-12" style={{background: 'antiquewhite',padding: '10px',borderBottom: '1px solid gainsboro'}}>
                    <div className="col-xs-12">
                       <b><i>Create New Template</i></b> <br /> 
                    </div>
                </div>
                <div className="col-xs-12" style={{fontSize: '20px',padding: "10px 20px 20px",borderBottom: '1px solid gainsboro'}}>
                    <TextField
                    ref='Name'
                    floatingLabelText="Template Name"
                    fullWidth={true}
                    errorText={this.state.errName}
                    floatingLabelFixed={true}
                    />
                    <TextField
                    ref='subject'
                    floatingLabelText="Subject"
                    fullWidth={true}
                    errorText={this.state.errSub}
                    floatingLabelFixed={true}
                    />
                    <br />  
                </div>

                <div className="col-xs-12" style={{marginBottom: '15px',borderBottom: '1px solid gainsboro'}}>
                <MyEditor data={this.state.content} content={(mail)=>{
                    this.setState({content:mail})
                }}/>
                </div>
                  <RaisedButton
                    style={{float:'right',margin:'20px'}}
                    label='Back'
                    onClick={this.gotoTmppage.bind(this)}
                    primary={true} 
                    ></RaisedButton>
                 <RaisedButton
                    style={{float:'right',margin:'20px'}}
                    label='save'
                    onClick={this.saveTemplate}
                    primary={true} 
                    ></RaisedButton>
            </div>

        </div>
        </div>
        <div className={this.state.tmppage} style={{margin:'0px 4px 0px'}}>
                    <div className="col-xs-12">
            <div className='row'>
            <div className='col-xs-12' style={{paddingTop:'10px',paddingRight:'28px'}}>
            <RaisedButton
                    style={{float:'right',margin:'0px'}}
                    label='Add New Template'
                    onClick={this.openCreatetemplate}
                    primary={true} 
                    ></RaisedButton>
            </div>
            <div className={this.state.loader} style={style.container}>
                <RefreshIndicator
      size={70}
      left={10}
      top={0}
      status="loading"
      style={style.refresh}
    />
    </div>
                {templates}
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
            </div>
        
        );
    }
}

export default withRouter(SendEmail)


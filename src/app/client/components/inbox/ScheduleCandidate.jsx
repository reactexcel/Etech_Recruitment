import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router'
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import FlatButton from 'material-ui/FlatButton'
import Chip from 'material-ui/Chip';
import {pinkA100} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Badge from 'material-ui/Badge';
import MyEditor from '../sendmail/editor'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {cyan100,cyan50,grey50,red700,green500,grey200} from 'material-ui/styles/colors';
import Select from 'material-ui/svg-icons/action/done';
import Paper from 'material-ui/Paper';
import RichTextEditor from 'react-rte';

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '20px'
  },
  formInput:{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "90%"
  },
  editorStyle: {
    overflow: 'auto',
    display: 'block',
    width: '100%',
    height: '300px',
    maxHeight: '300px',
    background:'rgba(204,204,204,.51)',
  },
};

class ScheduleCandidate extends React.Component {
  constructor( props ){
        super( props );
        this.state={
          scheduledDate:moment().format("DD-MM-YYYY"),
          scheduledTime:moment().format("hh:mm:ss a"),
          templatePop:false,
          pickedTemplate:[],
          pValue:[],
          openVarDialog: false,
          openPreview:false,
          sentMail:{},
          errName:'',
          errSub:'',
          content:'',
          templateName:'',
          templateSubject:'',
          templateBody:RichTextEditor.createEmptyValue(),
          openSendMailDialog:false,
          mailSendTo:'',
        }
        this.handleCloseScheduleDialog=this.handleCloseScheduleDialog.bind(this);
        this.forwardTemplate=this.forwardTemplate.bind(this);
        this.handleCloseSendMailDialog = this.handleCloseSendMailDialog.bind(this);
        this.applyVariables = this.applyVariables.bind(this);
        this.replaceVariablesWithValue = this.replaceVariablesWithValue.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.openMailPreview = this.openMailPreview.bind(this);
        this.setVariable = this.setVariable.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.handleClose = this.handleClose.bind(this)
        this.closeMailPreview = this.closeMailPreview.bind(this)
        //this.handleCloseTemplateDialog=this.handleCloseTemplateDialog.bind(this);
    }
    handleCloseScheduleDialog(){
      this.props.closeDialog()
    }
    handleContentChange(value) {
      this.setState({templateBody: value});
    }
    handleCloseSendMailDialog(){
      this.setState({
        openSendMailDialog:false,
        templateId:'',
        templateName: '',
        templateSubject: '',
        templateBody: '',
        uploadedPDF:[],
        upload_file:[]
      });
      this.handleCloseScheduleDialog();
    }
    /*handleCloseTemplateDialog(){
      this.setState({
        templatePop:false,
        pickedTemplate:[]
      })
    }*/
    replaceVariablesWithValue(templ, str, value){
      if(value != undefined){
      if(value.indexOf("<p>") > -1){
        let no_lines = value.split("\n").length;
        if(no_lines > 1){
          value = value.replace(/<p/img, "<div");
          value = value.replace(/<\/p/img, "</div");
        }else{
          value = value.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
        }
      }
      var index = templ.body.indexOf(str);
      var i
      for(i=0;i<=20;i++){
        if(templ.body.indexOf(str) == -1){
          break;
        }
        templ.body = _.replace(templ.body, str, value);
      }
      templ.name = _.replace(templ.name, str, value);
      templ.subject = _.replace(templ.subject, str, value);
      }
      return templ;
    }
    applyVariables(templateId){
      let _id = ''
      let name = ''
      let subject = ''
      let content = ''
      let templ = {}
      let recipient = this.props.currentEmail;
      _.map(this.props.emailTemplates, (tmp, i) =>{
        if(tmp._id === templateId){
          _id = _.clone(tmp._id);
          name = _.clone(tmp.name);
          subject = _.clone(tmp.subject);
          content = _.clone(tmp.content);
        }
      });
      templ._id = _id
      templ.name = name
      templ.subject = subject
      templ.body = content
      let format = 'DD-MM-YYYY';
      let string = templ.name.concat(" ",templ.subject," ", templ.body);
      let regx = /#[\w\/|-]*/g;
      let variables = string.match(regx);
      if(variables !== null && variables.length > 0){
        variables = _.uniq(variables);
        variables.map((str,i)=>{
          let dateVariable = false;
          if(str.indexOf('|') !== -1){
            dateVariable = str;
            let res = str.split('|');
            str = res[0];
            format = res[1];
          }
          let variable = _.find(this.props.variables, function(o) { return o.varCode == str });
          if(typeof variable !== 'undefined' &&  variable.varCode == str){
            if(variable.variable_type == 'user' || variable.varCode == '#logo'){
              templ = this.replaceVariablesWithValue(templ, str, variable.varValue);
            }
            if(_.includes(variable.varCode, '#date')){
              let value = new Date();
              value = moment(value).format(format);
              if(dateVariable === false){
                templ = this.replaceVariablesWithValue(templ, str, value);
              }else{
                templ = this.replaceVariablesWithValue(templ, dateVariable, value);
              }
            }
            if(variable.variable_type === 'system' && !_.isEmpty(recipient) && !_.includes(variable.varCode, '#date') && !_.includes(variable.varCode, '#logo') ){
              let value;
              if(variable.varCode == '#candidate_name'){
                value = recipient.from
                this.setState({
                  mailSendTo:value
                })
              }else if(variable.varCode == '#candidate_email_id'){
                value = recipient.sender_mail
              }else if(variable.name == '#page_break'){
                value = "<div style='page-break-after:always;'></div>"
              }
              if(dateVariable === false){
                templ = this.replaceVariablesWithValue(templ, str, value);
              }else{
                templ = this.replaceVariablesWithValue(templ, dateVariable, value);
              }
            }
          }
        })
      }
      this.setState({
        templateName: templ.name,
        templateSubject: templ.subject,
        templateBody: RichTextEditor.createValueFromString(templ.body, 'html'),
      });
    }

    openMailPreview(){
      let recipient = this.props.currentEmail,
          templateName = this.state.templateName.trim(),
          templateSubject = this.state.templateSubject.trim(),
          templateBody = this.state.templateBody.toString('html'),
          state = true,
          error = '';
          if(state){
            let string = templateName.concat(" ",templateSubject," ", templateBody);
            let regx = /#[\w-]+\|[\w -\.,@$%&*!%^\\\/]+\||#[\w-]+/ig;
            let result = string.match(regx);
            let pendingVariables = [];
            if(result !== null && result.length > 0){
              state = false;
              error = "Please put all variable's value";
              result = _.uniq(result);
              result.map((str)=>{
                 let start_pos = str.indexOf('|') + 1;
                 let end_pos = str.indexOf('|',start_pos);
                 let defaultValue = str.substring(start_pos,end_pos)
                 pendingVariables.push({name:str,value:defaultValue});
               });
               this.setState({
                 pValue: pendingVariables,
                 openVarDialog: true,
               });
             }
           }
           if(state){
            let email = [{
                email_id: recipient.sender_mail,
                name: recipient.from,
                subject: templateSubject,
                body: templateBody,
              }]
              this.setState({
                openPreview:true,
                sentMail:{status:state, email:email}
              })
           }
    }
    setVariable(){
      let pValue = this.state.pValue,
          template = {
            name:this.state.templateName.trim(),
            subject:this.state.templateSubject.trim(),
            body:this.state.templateBody.toString('html'),
          };

      _.map(pValue, (variable, i)=>{
        if(typeof variable.value !== 'undefined'){
          template = this.replaceVariablesWithValue(template, variable.name, variable.value)
        }
      });

     this.setState({
       templateName: template.name,
       templateSubject: template.subject,
       templateBody: RichTextEditor.createValueFromString(template.body, 'html'),
       pValue: null,
     },
     ()=>{
       this.handleClose();
       this.openMailPreview();
     });
    }
    handleClose(){
      this.setState({
        openVarDialog: false,
        pValue: _.remove(this.state.pValue),
      });
    }
    forwardTemplate(template){
      this.setState({
        openSendMailDialog:true,
        templateId:template._id,
        templateName: template.name,
        templateSubject: template.subject,
        templateBody: RichTextEditor.createValueFromString(template.content, 'html'),
        uploadedPDF:[],
        upload_file:[]
      });
      this.applyVariables(template._id);
    }
    closeMailPreview(){
      this.setState({
        openPreview: false,
        sentMail:{},
      });
    }
    /*submitMail(idList){
      let name=this.state.currentTemplatName.trim()
      let subject=this.state.currentSubject.trim()
      let content=this.state.currentContent
      this.props.onSendMailToCandidate(idList,name,subject,content,this.props.scheduleTagId)
      //this.handleCloseTemplateDialog()
    }*/
    sendMail(){
      this.closeMailPreview();
      let sentMail = this.state.sentMail;
      let idList = [];
      let name = sentMail.email.name
      let subject = sendMail.email.subject
      let body = sendMail.email.body
      let scheduledTagId = this.props.scheduleTagId
      idList.push(sendMail.email.email_id)
      if(sentMail.status){
        this.props.onSendMailToCandidate(idList,name,subject,body,scheduledTagId).then(()=>{
          this.handleCloseSendMailDialog();
          //this.showError('mailsentsuccessfully','Mail sent successfully.');
        }).catch(()=>{
          //this.showError('previewalert','Mail not sent. try again')
        })
      }
    }
    render(){
    let templates=[];
    const actions = [
          <RaisedButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleCloseScheduleDialog}
          />]
    const actionsSendMail = [
            <FlatButton label="Close" primary={true} onTouchTap={this.handleCloseSendMailDialog} style={{marginRight:5}} />,
            <RaisedButton label={"Preview"} primary={true} onClick={this.openMailPreview} />
          ];
    /*const templateAction =  [
          <FlatButton
           label="Cancel"
           primary={true}
           onTouchTap={this.handleCloseTemplateDialog}
          />,
          <FlatButton
           label="Send"
           primary={true}
           onTouchTap={()=>{this.submitMail(this.props.emailIdList)}}
          />,
    ];*/
    _.map(this.props.emailTemplates,(template, key)=>{
      templates.push(
        <div className="col-xs-6" key={template._id} style={{marginBottom:'20px'}}>
          <Card zDepth={2}>
            <Paper
              style={{marginTop:"5px",paddingBottom: "0px"}}
              actAsExpander={true}
              zDepth={1}
              children={<CardHeader
                title={template.name}
                subtitle={"Subject: "+template.subject}
                actAsExpander={true}
                showExpandableButton={true}
                style={{'backgroundColor':cyan100}}
              />}
            />
            <CardText expandable={true}>
              {<div className="col-xs-12 m-b"><span style={{display: 'inline-flex'}}><b>Body: </b><div className="p-l" dangerouslySetInnerHTML={{__html:template.content}}></div></span></div>}
            </CardText>
            <CardActions style={{'textAlign':'right'}}>
              <RaisedButton 
                secondary={true}
                labelColor={grey50} 
                label="Forward" 
                labelPosition="before" 
                icon={<Select color={grey50}/>} 
                style={{'margin':4,'padding':-1}}
                onTouchTap={() => {this.forwardTemplate(template)}}
              />
            </CardActions>
          </Card>
        </div>
        )
    })
    let pendingVar = [];
      _.map(this.state.pValue,(variable, i)=>{
        pendingVar.push(
          <div className="form-group" key={i}>
            <label>Enter value for {variable.name} :</label>
              <input type="text" className="form-control" onChange={(e)=>{
                variable.value = e.target.value;
                this.setState({
                  pValue: this.state.pValue,
                });
                }}
                value={variable.value} 
              />
          </div>)
        })
      return(
        <div>
          <Dialog
            title="Select Template"
            modal={false}
            bodyStyle={{minHeight:'70vh'}}
            contentStyle={{maxWidth:'90%',width:"90%",transform: 'translate(0px, 0px)'}}
            autoDetectWindowHeight={true}
            open={this.props.showPopUp}
            onRequestClose={this.handleCloseScheduleDialog}
            autoScrollBodyContent={true}
            actions={actions}
          >
            <Dialog
              title={"Send Mail"}
              actions={actionsSendMail}
              modal={false}
              bodyStyle={{minHeight:'70vh'}}
              contentStyle={{maxWidth:'90%',width:"90%",transform: 'translate(0px, 0px)'}}
              open={this.state.openSendMailDialog}
              onRequestClose={this.handleCloseSendMailDialog}
              autoDetectWindowHeight={true}
              autoScrollBodyContent={true}
            >
              <Dialog
                title={"Enter values"}
                actions={[<FlatButton label="Close" primary={true} onTouchTap={this.handleClose} style={{marginRight:5}} />,
                          <RaisedButton label={"Set Variables"} primary={true} onClick={this.setVariable}/>]}
                modal={false}
                bodyStyle={{minHeight:'50vh'}}
                contentStyle={{maxWidth:'90%',width:"50%",transform: 'translate(0px, 0px)'}}
                open={this.state.openVarDialog}
                onRequestClose={this.handleClose}
                autoDetectWindowHeight={true}
                   autoScrollBodyContent={true}
              >
                <div>
                  <div className="col-sx-12"></div>
                    {pendingVar}
                </div>
              </Dialog>
              <Dialog
                title={"Mail Preview"}
                titleStyle={{padding:'5px 24px 0px',textAlign:'center',fontSize:'18px',fontWeight:'500'}}
                actions={[<FlatButton label="Cancel" primary={true} onTouchTap={this.closeMailPreview} style={{marginRight:5}} />,
                            <RaisedButton label={"Continue"} primary={true} onClick={this.sendMail}/>]}
                modal={false}
                bodyStyle={{minHeight:'70vh'}}
                contentStyle={{maxWidth:'90%',width:"70%",transform: 'translate(0px, 0px)'}}
                open={this.state.openPreview}
                onRequestClose={this.closeMailPreview}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
              >
                <div id="dialogContent" style={{'fontFamily':'sans-serif','margin':'1.5cm 0 0','textAlign':'justify'}}>
                  <div className="p-t p-b" style={{fontWeight:'600',fontSize:'17px',marginTop: '5px',textAlign:'center','textDecoration': 'underline'}} dangerouslySetInnerHTML={{__html: this.state.sentMail && this.state.sentMail.email && this.state.sentMail.email[0].subject}}></div>
                  <div className="p-t p-b" dangerouslySetInnerHTML={{__html: this.state.sentMail && this.state.sentMail.email && this.state.sentMail.email[0].body}}></div>
                </div>
              </Dialog>
              <div className="col-xs-12" style={{'marginTop':'15px'}}>
                <form className="form-inline">
                  <div className="form-group" style={styles.formInput}>
                    <div className="pull-left to"><span style={{'fontWeight':'bold','fontSize':'12px'}}>{"To : "}</span>
                      <span className="label label-info">{this.state.mailSendTo}</span>
                    </div>
                  </div>
                  <div className="form-group" style={styles.formInput}>
                    <TextField
                      ref='value'
                      floatingLabelText="Template Name"
                      floatingLabelFixed={true}
                      hintText="Template Name"
                      fullWidth={true}
                      disabled={true}
                      errorText={this.state.errName}
                      value={this.state.templateName}
                      onChange={(e)=>{
                        this.setState({
                          templateName: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="form-group" style={styles.formInput}>
                    <TextField
                      ref='Name'
                      floatingLabelText="Subject"
                      floatingLabelFixed={true}
                      hintText="Subject"
                      fullWidth={true}
                      errorText={this.state.errSub}
                      value={this.state.templateSubject}
                      onChange={(e)=>{
                        this.setState({
                          templateSubject: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="form-group" style={styles.formInput}>
                    <label style={{'marginTop':'10px','fontWeight':'bold','fontSize':'12px'}}>Body:</label>
                    <RichTextEditor
                      style={styles.editorStyle}
                      id={"editor"}
                      value={this.state.templateBody}
                      onChange={this.handleContentChange}
                      readOnly={true}
                    />
                  </div>
                </form>
              </div>
            </Dialog>
            <div style={styles.wrapper}>
              {templates}
            </div>
          </Dialog>
        </div>
        )
    }
}
export default ScheduleCandidate
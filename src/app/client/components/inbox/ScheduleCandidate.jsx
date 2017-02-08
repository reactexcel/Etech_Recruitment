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
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {cyan100,cyan50,grey50,red700,green500,grey200} from 'material-ui/styles/colors';
import Select from 'material-ui/svg-icons/action/done';
import PdfIcon from 'material-ui/svg-icons/file/attachment';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import RichTextEditor from 'react-rte';
import LinearProgress from 'material-ui/LinearProgress';
import {config_ENV} from './../../../config';
var FormData = require('form-data');

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
  uploadButton:{
    'position':'relative',
    'overflow':'hidden',
    'margin':'10px 10px 10px 54px',
    'cursor':'pointer',
  },
  uploadInput:{
    'color':'transparent',
    'position':'absolute',
    'top':0,
    'right':0,
    'margin':0,
    'padding':0,
    'fontSize':'20px',
    'cursor':'pointer',
    'opacity':0,
  },
    rows:{
      'boxShadow': '0px 0px 5px #888888',
      'height':'30px',
      'display':'block',
      'color':'#0099cc',
      'fontWeight':'bold',
      'fontStyle':'italic',
      'paddingTop':'1%',
      'marginTop':'2%'
    },
    filename:{
      'whiteSpace': 'nowrap',
      'overflow':'hidden',
      'textOverflow':'ellipsis',
    },
    crossButton:{
      'color':'red',
      'float':'right',
      'marginTop':'3px',
      'cursor':'pointer'
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
          SnackbarOpen:false,
          SnackbarMessage:'',
          upload_file:[],
          uploadedPDF:[],
          LinearProgressBar:[],
          pageHeader:'',
          pageFooter:''
        }
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
        this.uploadPDF=this.uploadPDF.bind(this)
        this.deleteAttachment = this.deleteAttachment.bind(this)
        this.download_mail_preview = this.download_mail_preview.bind(this)
        //this.handleCloseTemplateDialog=this.handleCloseTemplateDialog.bind(this);
    }
    componentWillReceiveProps(props){
      if(props.currentAction.template_id != ""){
         _.map(props.emailTemplates,(template, key)=>{
           if(template._id == props.currentAction.template_id){
            this.forwardTemplate(template,props)
           }
         })
      }
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
        upload_file:[],
        LinearProgressBar:[],
        openPreview:false
      });
      this.props.closeDialog()
    }
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
    applyVariables(templateId,props){
      let _id = ''
      let name = ''
      let subject = ''
      let content = ''
      let templ = {}
      let recipient = props.currentEmail;
      _.map(props.emailTemplates, (tmp, i) =>{
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
      //let regx = /#[\w\/|-]*/g;
      let regx = /#[\w-]+\|[\w -\.,@$%&*!:%^\\\/]+\||#[\w-]+/ig;
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
          let variable = _.find(props.variables, function(o) { return o.varCode == str });
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
              }else if(variable.varCode == '#page_break'){
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
      let pageHeader = '', pageFooter = ''
      _.map(this.props.variables, (variable, i)=>{
        if(variable.varCode == "#page_header"){
          pageHeader = variable.varValue
        }
        if(variable.varCode == "#page_footer"){
          pageFooter = variable.varValue
        }
      });
      let recipient = this.props.currentEmail,
          templateName = this.state.templateName.trim(),
          templateSubject = this.state.templateSubject.trim(),
          templateBody = this.state.templateBody.toString('html'),
          state = true,
          error = '';
          if(state){
            let string = templateName.concat(" ",templateSubject," ", templateBody);
            let regx = /#[\w-]+\|[\w -\.,@$%&*!:%^\\\/]+\||#[\w-]+/ig;
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
                _id: recipient._id,
                name: recipient.from,
                subject: templateSubject,
                body: templateBody,
              }]
              this.setState({
                openPreview:true,
                sentMail:{status:state, email:email},
                pageHeader:pageHeader,
                pageFooter:pageFooter
              })
           }
    }
    setVariable(){
      let pValue = this.state.pValue,
          flag = 1,
          template = {
            name:this.state.templateName.trim(),
            subject:this.state.templateSubject.trim(),
            body:this.state.templateBody.toString('html'),
          };
      _.map(pValue, (variable, i)=>{
        if(typeof variable.value !== 'undefined' && variable.value !== ''){
          template = this.replaceVariablesWithValue(template, variable.name, variable.value)
        }else{
          flag = 0
        }
      });
      if(flag == 1){
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
      }else{
        this.setState({
          SnackbarOpen:true,
          SnackbarMessage:'Please put all variable`s value',
        })
      }
     
    }
    handleClose(){
      this.setState({
        openVarDialog: false,
        pValue: _.remove(this.state.pValue),
      });
    }
    forwardTemplate(template,props){
      this.setState({
        openSendMailDialog:true,
        templateId:template._id,
        templateName: template.name,
        templateSubject: template.subject,
        templateBody: RichTextEditor.createValueFromString(template.content, 'html'),
        uploadedPDF:[],
        upload_file:[]
      });
      this.applyVariables(template._id,props);
    }
    closeMailPreview(){
      this.setState({
        openPreview: false,
        sentMail:{},
      });
    }
    sendMail(){
      let sentMail = this.state.sentMail;
      let idList = [];
      let name = sentMail.email[0].name
      let subject = sentMail.email[0].subject
      let body = sentMail.email[0].body
      let fileName = this.state.uploadedPDF
      let filePath = this.state.upload_file
      let attachment = []
      _.map(fileName,(name, key)=>{
        attachment.push({'filename':fileName[key],'path':filePath[key]})
      })
      idList.push(sentMail.email[0]._id)
      if(sentMail.status){
        this.props.onSendMailToCandidate(idList,name,subject,body,this.props.currentAction._id,attachment,this.props.testing).then((data)=>{
          this.handleCloseSendMailDialog();
          this.setState({
            SnackbarOpen: true,
            SnackbarMessage:data
          });
        }).catch((error)=>{
          this.setState({
            SnackbarOpen: true,
            SnackbarMessage:error
          });
        })
      }
    }
    handleRequestClose = () => {
      this.setState({
        SnackbarOpen: false,
      });
    };
    uploadPDF(e){
      let self = this
      var file_data = $("#file_image").prop("files");
      var form_data = new FormData();
        var LinearProgressBar = [];
        for( var i in file_data){
          if(typeof file_data[i] == 'object'){
            let ext = file_data[i].name.substring(file_data[i].name.lastIndexOf('.') + 1);
            if(ext == "pdf" || ext == "PDF"){
              form_data.append(i.toString(), file_data[i])
            }else{
              this.setState({
                SnackbarOpen: true,
                SnackbarMessage:'Please upload the document in pdf format.'
              });
            }
          }
        }
        for(i=0;i<file_data['length'];i++){
          LinearProgressBar.push(<div key={i} className="row" style={styles.rows}>
            <div className="col-xs-7" style={styles.filename}>
              {file_data[i].name}
            </div>
            <div className="col-xs-5">
              <LinearProgress mode="indeterminate"/>
            </div>
            </div>)
        }
        self.setState({
          LinearProgressBar:LinearProgressBar
        })
        /*form_data.forEach(function(d,i){
          console.log({d,i})
        })*/
      $.ajax({
          url: config_ENV.upload_email_attachment,
          contentType: false,
          processData: false,
          data: form_data,
          type: 'post',
          success: function(data) {
            let obj = JSON.parse(data);
            let uploadedPDF = self.state.uploadedPDF;
            let upload_file_path = self.state.upload_file;
            let preKey = uploadedPDF.length
             if(obj.error == 0){
               let data = obj.data
               _.map(data,(file, key)=>{
                   uploadedPDF.push(file.name);
                   upload_file_path.push(config_ENV.pdf_url+file.path)
                 })
             }
             self.setState({
              uploadedPDF:uploadedPDF,
              upload_file:upload_file_path,
              LinearProgressBar:[]
             })
          },
          error: function(error) {
            //console.log(error,"error")
          }
        });
    }
    deleteAttachment(filekey){
      let uploadedPDF = this.state.uploadedPDF;
      let newuploadedPDF = []
      let upload_file_path = this.state.upload_file;
      let newupload_file_path = []
      _.map(uploadedPDF,(file, k)=>{
       if(filekey != k){
         newuploadedPDF.push(uploadedPDF[k])
         newupload_file_path.push(upload_file_path[k])
       }
     })
      this.setState({
        uploadedPDF:newuploadedPDF,
        upload_file:newupload_file_path
      })
    }
    download_mail_preview(e){
      let currentTimeStamp = moment().unix()
      let fileName = 'mail-preview'
      let htmlFile = $('#dialogContent').html();
      var form_data = new FormData();
      form_data.append('html', htmlFile);
      form_data.append('header', this.state.pageHeader);
      form_data.append('footer', this.state.pageFooter);
      form_data.append('file_name', fileName);
      $.ajax({
          url: config_ENV.create_pdf,
          contentType: false,
          processData: false,
          data: form_data,
          type: 'post',
          success: function(suc) {
            let response = JSON.parse(suc)
            var link = document.createElement('a');
            link.href = config_ENV.pdf_url+response.data.message+'?'+currentTimeStamp;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
          },
          error: function(error) {
          }
        });
    }
    render(){
      let fileList = []
      _.map(this.state.uploadedPDF,(name, key)=>{
          fileList.push(
            <div key={key} className="row" style={styles.rows}>
            <div className="col-xs-10" style={styles.filename}>
              {name}
            </div>
            <div className="col-xs-2">
              <span
                onClick={()=>{this.deleteAttachment(key)}}
                style={styles.crossButton}
                className="glyphicon glyphicon-remove">
              </span>
            </div>
          </div>)
      })
    let templates=[];
    const actionsSendMail = [
            <FlatButton label="Close" primary={true} onTouchTap={this.handleCloseSendMailDialog} style={{marginRight:5}} />,
            <RaisedButton label={"Set Variables"} primary={true} onClick={this.openMailPreview} />
          ];
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
                          <RaisedButton label={"Preview Mail"} primary={true} onClick={this.setVariable}/>]}
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
                            <RaisedButton label={"Send Mail"} primary={true} onClick={this.sendMail}/>,
                            <FlatButton label={"Download Preview"} primary={true} style={{"float":'left'}} onClick={(e)=>{this.download_mail_preview(e)}}/>]}
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
                <div className="row" style={{'marginTop':'1%','marginRight':'0px','marginLeft':'5%'}}>
                  <div className="col-xs-5">
                    {this.state.LinearProgressBar}
                    {fileList}
                  </div>
                </div>
                
                <form action={''} method="POST" encType="multipart/form-data">
                  <div className="form-group" style={{'cursor':'pointer'}}>
                    <button style={styles.uploadButton} className="btn btn-blue" >
                      <input onChange={(e)=>{this.uploadPDF(e)}} style={styles.uploadInput} id="file_image" type="file" name="image[]" ref="file" className="form-control" multiple={true}/>
                      <span style={{'color':'black'}}>Attachment</span>
                    </button>
                  </div>
                </form>
              </div>
            </Dialog>
            <div style={styles.wrapper}>
              {templates}
            </div>
          <Snackbar
            open={this.state.SnackbarOpen}
            message={this.state.SnackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
        )
    }
}
export default ScheduleCandidate
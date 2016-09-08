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
import MyEditor from '../sendmail/editor'

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
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
          errName:'',
          errSub:'',
          content:'',
          currentTemplatName:'',
          currentSubject:'',
          currentContent:''
        }
        this.handleCloseScheduleDialog=this.handleCloseScheduleDialog.bind(this);
        this.submitMail=this.submitMail.bind(this);
        this.openSelectedSchedule=this.openSelectedSchedule.bind(this);
        this.handleCloseTemplateDialog=this.handleCloseTemplateDialog.bind(this);
    }
    handleCloseScheduleDialog(){
      this.props.closeDialog()
    }
    handleCloseTemplateDialog(){
      this.setState({
        templatePop:false,
        pickedTemplate:[]
      })
    }
    submitMail(idList){
      //let name=this.refs.Name.input.value.trim()
      let name=this.state.currentTemplatName.trim()
      //let subject=this.refs.subject.input.value.trim()
      let subject=this.state.currentSubject.trim()
      //let content=this.state.content
      let content=this.state.currentContent

      this.props.onSendMailToCandidate(idList,name,subject,content,this.props.scheduleTagId)
      this.handleCloseTemplateDialog()
    }
    openSelectedSchedule(templateId){
       _.map(this.props.emailTemplates,(template, key)=>{
           if(template._id == templateId){
            let newContent=_.replace(template.content, "defaultDate", this.state.scheduledDate);
                newContent=_.replace(newContent, "defaultTime", this.state.scheduledTime);
            this.setState({
                currentTemplatName:template.name,
                currentSubject:template.subject,
                currentContent:newContent
            })
               this.state.pickedTemplate.push(
                <div className="row">
                <div className='col-lg-12' key={key}>
                    <div style={{border:'1px solid gray',borderRadius:'5px', height:'auto',margin:'10px',padding:'10px',background: '#fff',}}>
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Template Name : </span>{template.name}</div>
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Subject : </span>{template.subject}</div>
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>
                    Email Body : </span>
                    <span style={{display:'block',width:'95%',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}} dangerouslySetInnerHTML={{__html:newContent}}></span></div>
                    </div>
                </div>
                </div>
                )
           }
      })
      this.setState({
        templatePop:true
      })
    }
    render(){

    let templates=[];
    const templateAction =  [
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
    ];
    _.map(this.props.emailTemplates,(template, key)=>{
      templates.push(
        <Chip
          key={key}
          backgroundColor={pinkA100}
          onTouchTap={()=>{this.openSelectedSchedule(template._id)}}
          style={styles.chip}
        >
          {template.name}
        </Chip>
        )
    })
      return(
        <div>
               <Dialog
                     title="Schedule candidate"
                     modal={false}
                     open={this.props.showPopUp}
                     onRequestClose={this.handleCloseScheduleDialog}
                    >
                    <div>
                    <div style={{textAlign: 'left',fontSize:'17px'}}>Create Time slot:</div>
                     <DatePicker hintText={this.state.scheduledDate} onChange={(evt,date)=>{
                          this.setState({
                             scheduledDate:moment(date).format("DD-MM-YYYY")
                          })
                     }}/>
                     <TimePicker hintText={this.state.scheduledTime} onChange={(evt,time)=>{
                          this.setState({
                            scheduledTime:moment(time).format("hh:mm:ss a")
                          })  
                     }}/>
                    </div>
                    <div style={styles.wrapper}>
                    {templates}
                    </div>
                    <div>
                    <Dialog
                     actions={templateAction}
                     modal={false}
                     open={this.state.templatePop}
                     onRequestClose={this.handleCloseTemplateDialog}
                    >
                    {this.state.pickedTemplate}
                    </Dialog>
                    </div>
                    </Dialog>
        </div>
        )
    }
}
export default ScheduleCandidate
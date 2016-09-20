import React, {PropTypes} from 'react';
import { withRouter, Link } from 'react-router';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import List from 'material-ui/List'
import CandidateHistory from './candidateHistory'

import {Menu, MenuItem} from 'material-ui/Menu'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import _ from 'lodash';
import MyCard from './MyCard';

import Chip from 'material-ui/Chip';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ScheduleCandidate from '../inbox/ScheduleCandidate'
const styles = {
  errorStyle: {
    textAlign:'left',
  },
}

class EmailBody extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        data:'',
        rejectpop:false,
        schedulePop:false,
        reason:'',
        errortxt:'',
        SnackbarOpen:false,
        SnackbarMessage:'',
        popUpContent:[],
        popUpContentOpen:false,
        scheduledDate:'',
        scheduledTime:'',
        actionId:''

    }
    this.handleClose=this.handleClose.bind(this)
    this.handleCloseVariable=this.handleCloseVariable.bind(this)
    this.submitreason=this.submitreason.bind(this)
    this.ignoreCandidate=this.ignoreCandidate.bind(this)
    this.rejectCandidate=this.rejectCandidate.bind(this)
    this.candidateAction=this.candidateAction.bind(this)
    this.openPopUp=this.openPopUp.bind(this)
    this.match_value = []
    this.ignoreTagId = "";
    this.rejectTagId = '';
    this.scheduleTagId = "";
    this.ignoreText = 'Ignore';
    this.rejectText = 'Reject';
    this.scheduleText = 'Schedule';
  }
componentWillMount(){
   _.map(this.props.inboxTag,(tag)=>{
      if(tag.name=="Ignore"){
          this.ignoreTagId = tag._id
      }
      if(tag.name=="Reject"){
          this.rejectTagId = tag._id
      }
      if(tag.name=="Schedule"){
          this.scheduleTagId = tag._id
      }
    })
}
componentWillReceiveProps(props){
    let id = props.params.id
    let data;
    _.map(props.email,(email)=>{
        if(email._id == id){
          this.setState({
            data:email,
          })
        }
    })

}
openPopUp(action){
  let tempId = action.template_id
  let template = []
   _.map(this.props.emailTemplates,(temp)=>{
        if(temp._id == tempId){
           template.push(temp)
        }
    })
   let content = template[0].content
   this.match_value = content.match(/#{1}[a-zA-Z_]+/ig)
   _.map(this.match_value,(val)=>{
        if(val == "#candidate_name"){
          this.match_value['#candidate_name']=this.state.data.from
          this.state.popUpContent.push(
            <div>
            <TextField
             disabled={true}
             floatingLabelText={val}
             floatingLabelFixed={true}
             value={this.match_value['#candidate_name']}
            />
            </div>
            )
        }
        if(val == "#candidate_email"){
          this.match_value['#candidate_email']=this.state.data.sender_mail
          this.state.popUpContent.push(
            <div>
            <TextField
             disabled={true}
             floatingLabelText={val}
             floatingLabelFixed={true}
             value={this.match_value['#candidate_email']}
            />
            </div>
            )
        }
        if(val == "#current_date"){
          this.match_value['#current_date']=moment().format('MMMM Do YYYY, h:mm:ss a')
          this.state.popUpContent.push(
            <div>
            <TextField
             disabled={true}
             floatingLabelText={val}
             floatingLabelFixed={true}
             value={this.match_value['#current_date']}
            />
            </div>
            )
        }
        if(val == "#schedule_date"){
          this.state.popUpContent.push(
            <div>
            <DatePicker floatingLabelText={val} hintText="Date" onChange={(evt,date)=>{
                          this.setState({
                             scheduledDate:moment(date).format("DD-MM-YYYY")
                          })
            }}/>
            </div>
            )
        }
        if(val == "#schedule_time"){
          this.state.popUpContent.push(
            <div>
            <TimePicker floatingLabelText={val} onChange={(evt,time)=>{
                          this.setState({
                            scheduledTime:moment(time).format("hh:mm:ss a")
                          })  
            }}/>
            </div>
            )
        }
    })
    if(this.props.variables.length > 0){
      let dbVariable = this.props.variables
      _.map(dbVariable,(vari)=>{
        if(_.includes(this.match_value,vari.varCode )){
          this.match_value[vari.varCode]=vari.varValue
          this.state.popUpContent.push(
          <div>
            <TextField
             disabled={true}
             floatingLabelText={vari.varCode}
             floatingLabelFixed={true}
             value={this.match_value[vari.varCode]}
            />
          </div>
          )
          
        }
      })
      
    }
   console.log(this.match_value,"000000")
   console.log(this.state.popUpContent,"popup content")
   this.setState({
     popUpContentOpen:true,
     actionId:action._id
   })

}
  candidateAction(actionId, emailId){
    let date=false
    let time=false
    if(_.includes(this.match_value,"#schedule_date" )){
      if(this.state.scheduledDate==""){
          this.setState({
             SnackbarOpen: true,
             SnackbarMessage:"Enter Schedule Date"
          });
        }else{
           this.match_value['#schedule_date'] = this.state.scheduledDate
           date=true
        }
      }else{
        date=true
      }
      if(_.includes(this.match_value,"#schedule_time" )){
        if(this.state.scheduledTime==""){
          this.setState({
             SnackbarOpen: true,
             SnackbarMessage:"Enter Schedule Time"
          });
        }else{
           this.match_value['#schedule_time'] = this.state.scheduledTime
           time=true
        }
      }else{
        time=true
      } 
      if(date==true && time==true){
        this.setState({
            popUpContentOpen:false,
        })
        let key=[]
        let value=[]
        _.map(this.match_value,(val)=>{
          key.push(val)
          value.push(this.match_value[val])
        })
        console.log(key,"key")
        console.log(value,"value")
        this.props.onCandidateAction(actionId, emailId, key,value).then((data)=>{
             this.setState({
               popUpContent:[],
               SnackbarOpen: true,
               SnackbarMessage:data.toString()
             });
        }).catch((err)=>{
             this.setState({
               SnackbarOpen: true,
               SnackbarMessage:err.toString()
          });
         })
        console.log(actionId)
        console.log("actionId")
        console.log(emailId)
        console.log("emailId")
        console.log(this.match_value)
        console.log("this.match_value")
      }
    
    /*this.props.onCandidateAction(actionId, emailId).then((data)=>{
      this.setState({
      SnackbarOpen: true,
      SnackbarMessage:data.toString()
    });
    }).catch((err)=>{
      this.setState({
      SnackbarOpen: true,
      SnackbarMessage:err.toString()
    });
    })*/
  }
  handleClose(){
    this.setState({rejectpop: false});
  }
  handleCloseVariable(){
    this.setState({
        popUpContent:[],
        popUpContentOpen:false,
        scheduledDate:'',
        scheduledTime:''
    })
  }
  ignoreCandidate(data,ignoreTagId){
    if(_.includes(data.tags,ignoreTagId)==false){
            this.ignoreText="Ignored";
            this.props.onIgnore([data._id],this.ignoreTagId).then(()=>{
                          this.props.router.push('/inbox/b');
                        }).catch( (error) => {
                           this.setState({
                             SnackbarOpen:true,
                             SnackbarMessage:error.toString(),
                          })
                        })

      }else{
            this.setState({
                "SnackbarOpen":true,
                "SnackbarMessage":"Candidates is already ignored"
            })
      }
  }
  rejectCandidate(data,rejectTagId){
    if(_.includes(data.tags,rejectTagId)==false){
           this.setState({rejectpop:true})
       }else{
            this.setState({
               "SnackbarOpen":true,
               "SnackbarMessage":"Candidates is already rejected"
            })
      }
  }
   handleRequestClose = () => {
    this.setState({
      SnackbarOpen: false,
      SnackbarMessage:''
    });
  };
  submitreason(id){
    let reason = this.refs.reg.input.value.trim()
    if(reason.length > 0){
         this.handleClose()
        this.props.onReject([id],this.rejectTagId,reason).then(()=>{
          this.rejectText="Rejected"
          this.props.router.push('/inbox/body');
        }).catch( (error) => {
          this.setState({
              SnackbarOpen:true,
              SnackbarMessage:error.toString(),
        })
     })
    }else{
        this.setState({
            errortxt:'Reason required'
        })
    }
  }
handleRequestDelete(emailId,TagId) {
  this.props.onRemoveTagFromCandidate(emailId,TagId).then((data)=>{
    this.setState({
              SnackbarOpen:true,
              SnackbarMessage:data.toString(),
        })
  }).catch((err)=>{
    this.setState({
              SnackbarOpen:true,
              SnackbarMessage:err.toString(),
        })
  })
}
render(){
        let data = this.state.data;
        //---dynamic actions
        let dynamicActions = this.props.dynamicActions;
        let actionMenu = []
        _.map(dynamicActions,(action)=>{
          let disable=0;
          if(action.dependentActionId != ""){
             if(_.includes(data.candidateActions,action.dependentActionId)==true){
              _.includes(data.candidateActions,action._id)?disable=1:disable=0
              actionMenu.push(<MenuItem primaryText={action.name} disabled={disable} onTouchTap={()=>{
                //this.candidateAction(action._id, [data._id])
                this.openPopUp(action)
              }} />)
             }
          }else{
            _.includes(data.candidateActions,action._id)?disable=1:disable=0
            actionMenu.push(<MenuItem primaryText={action.name} disabled={disable} onTouchTap={()=>{
              //this.candidateAction(action._id, [data._id])
              this.openPopUp(action)
            }} />)
          }
        })
        //-------candidate tags
      let candidateTags=[]
      let inboxTags = typeof this.props.inboxTag !== 'undefined'?this.props.inboxTag:[]
        _.map(inboxTags,(tag)=>{
          if(_.includes(data.tags,tag._id)==true){
            candidateTags.push(<Chip onRequestDelete={()=>{this.handleRequestDelete(data._id,tag._id)}}
              style={{border:'5px',margin:'2px'}} 
              labelStyle={{fontSize:'12px',marginTop:'0px'}} 
              backgroundColor={tag.color}>{tag.name}</Chip>)
          }
        })
        //---------
       let more_email = typeof data.more_emails !== 'undefined'?data.more_emails.sort(function(a,b){if(a.email_timestamp > b.email_timestamp)return -1;if(a.email_timestamp < b.email_timestamp)return 1; else return 0;}):[];
       if(_.includes(data.tags,this.ignoreTagId)==true){
                this.ignoreText="Ignored"
        }
        if(_.includes(data.tags,this.rejectTagId)==true){
                this.rejectText="Rejected"
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
        onTouchTap={()=>{this.submitreason(data._id)}}
      />,
    ];
	return(
    <div>
  <div>
 <AppBar
    title="Email"
    iconElementLeft={<IconButton onTouchTap={() => {this.props.router.push('/inbox/b')}}><NavigationArrowBack /></IconButton>}
    iconElementRight={
      <IconMenu 
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Tags " rightIcon={<ArrowDropRight />} menuItems={[
           <MenuItem primaryText={this.ignoreText} onTouchTap={()=>{
          this.ignoreCandidate(data,this.ignoreTagId)
        }}/>,
        <MenuItem primaryText={this.rejectText} onTouchTap={()=>{
          this.rejectCandidate(data,this.rejectTagId)
        }}/>,
        <MenuItem primaryText="Schedule" onTouchTap={()=>{this.setState({schedulePop:true})}}/>]
        } />
        <MenuItem primaryText="Actions &nbsp;&nbsp;&nbsp;" rightIcon={<ArrowDropRight />} menuItems={[actionMenu]} />
      </IconMenu>
    }
  />
  </div>
  <div className="row" style={{ "margin": "0px", "position" : "relative"}}>
    <div className="col-xs-12 col-sm-12" style={{ "float": "right"}}>

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
         floatingLabelText="Reason To Reject"
         />
        </div>
      </Dialog>
      <Dialog
          title="Email Template Variables"
          autoScrollBodyContent={true}
          actions={[
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseVariable}
        style={{'marginRight':2}}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{this.candidateAction(this.state.actionId, [data._id])}}
      />,
    ]}
          modal={false}
          open={this.state.popUpContentOpen}
          onRequestClose={this.handleCloseVariable}
        >
        {this.state.popUpContent}
      </Dialog>
      <ScheduleCandidate
                    scheduleTagId={this.scheduleTagId}
                    showPopUp={this.state.schedulePop}
                    emailIdList={[data._id]}
                    emailTemplates={this.props.emailTemplates}
                    {...this.props}
                    closeDialog={()=>{
                      this.setState({
                            schedulePop : false
                      })
                    }}
        />
        <div className="row" style={{marginLeft:'4px',marginRight:'4px'}}>
          <div className="col-sm-12 col-sx-12 col-lg-12">
              {_.map(more_email,( email, i) => (
                  <MyCard email={email} i={i} key={i} progresStatus={data.progresStatus} index={i} candidateTags={candidateTags} />
              ))}
              <MyCard email={data} i={typeof data.more_emails !== 'undefined'?-1:0} 
              progresStatus={data.progresStatus} 
              index={typeof data.more_emails !== 'undefined'?"more":"done"} 
              candidateTags={candidateTags} />
          </div>
        </div>

        <div className="row" style={{marginTop:'5px',marginBottom:'10px',marginLeft:'4px',marginRight:'4px'}}>
          <div className="col-sm-12 col-sx-12 col-lg-12">
              {typeof data !== 'object'?
              <LinearProgress mode="indeterminate" style={{"height":"5px", backgroundColor:"lightgray", borderRadius:"20px 20px","marginTop": "10px"}} />:
              <CandidateHistory candidateHistory={this.props.candidateHistory}/>
              }
          </div>
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
    )
}
}

export default EmailBody

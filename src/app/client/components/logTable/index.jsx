import React, {PropTypes} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
const classNames = require('classnames');


export default class LogTable extends React.Component{
    constructor(props){
    super(props);
    this.state={
      stepIndex: 0,
      current_email:'',
      logList:[],
      emailList:[],
      emails:[],
      numberOfLogs:5,
      hidden:false
    }
    this.onSelectingId=this.onSelectingId.bind(this)
    this.onSelectingAll=this.onSelectingAll.bind(this)
  }

  componentWillMount(){
    }
    componentWillReceiveProps( props ){
    }
    onSelectingId(username){
      this.setState({
        stepIndex: 0,
        current_email:username,
        logList:[],
        emailList:[],
        emails:[],
        hidden:true
      })

    }
    onSelectingAll(){
       this.setState({
        stepIndex: 0,
        current_email:'',
        logList:[],
        emailList:[],
        emails:[],
        hidden:false,
        numberOfLogs:5,
      })
    }
  render(){
    let logs=this.props.log.logs
    if(this.state.emailList.length==0){
      this.state.emailList.push(<MenuItem key={0} primaryText="Show all logs" onTouchTap={()=>this.onSelectingAll()}/>)
    }
    _.map(logs,(log,i)=>{
      if(_.includes(this.state.emails,log.username)==false){
        this.state.emails.push(log.username)
        this.state.emailList.push(
             <MenuItem key={i+1} primaryText={log.username} onTouchTap={()=>this.onSelectingId(log.username)}/>
          );
       }
    }) 

    const stepIndex = this.state.stepIndex;
    const self=this;
    if(logs.length>0){
    if(self.state.current_email==''){
      _.times(this.state.numberOfLogs,function(i){
        if(typeof logs[i] === 'undefined'){
           self.setState({
              numberOfLogs:0,
              hidden:true
           })
      }else{
        self.state.logList.push(
        <Step key={i} active={true}>
            <StepButton onTouchTap={() => self.setState({stepIndex: i})} style={{cursor:'pointer'}}>
              <div>{logs[i].username}</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({logs[i].created_on.toString()})</div>
            </StepButton>
            <StepContent style={{marginTop:'5px'}}>
              <div>
              <div style={{fontWeight:'bold'}}>
              Action:{logs[i].action_type}
              </div>
              <p>
                {logs[i].details}
              </p>
              </div>
            </StepContent>
          </Step>
        )
      }
      })
    }else{
      _.map(logs,(log,i)=>{
        if(self.state.current_email==log.username){
          this.state.logList.push(
        <Step key={i} active={true}>
            <StepButton onTouchTap={() => this.setState({stepIndex: i})} style={{cursor:'pointer'}}>
              <div>{log.username}</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({log.created_on.toString()})</div>
            </StepButton>
            <StepContent style={{marginTop:'5px'}}>
              <div>
              <div style={{fontWeight:'bold'}}>
              Action:{log.action_type}
              </div>
              <p>
                {log.details}
              </p>
              </div>
            </StepContent>
          </Step>
        )
        }
      })
    }
  }

        let next_page_link=<RaisedButton label="Load More" secondary={true} onTouchTap={ () =>{
          this.setState({
            stepIndex: 0,
            logList:[],
            emailList:[],
            emails:[],
            current_email:'',
            numberOfLogs:this.state.numberOfLogs+5
          });
        }}/>
        
    return(
      <div style={{marginBottom:5}}>
    <div style={{margin: 'auto',backgroundColor:'white',borderRadius:'3px',padding:10}}>
    <div style={{marginLeft:'4px',fontSize:'x-large'}}>
    Candidate Log
      <IconMenu
        style={{float:'right'}}
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        {this.state.emailList}
      </IconMenu>
    </div>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          {this.state.logList}
        </Stepper>
      </div>
      <div style={{textAlign:'center',marginTop:'10px'}} ref="button" className={classNames({"hidden":this.state.hidden})}>
        {next_page_link}
      </div>
      </div>
      );
  }
}

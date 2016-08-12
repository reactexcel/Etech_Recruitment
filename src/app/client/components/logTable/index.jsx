import React, {PropTypes} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import _ from 'lodash';
const classNames = require('classnames');
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


export default class Login extends React.Component{
	static contextTypes={
			muiTheme:React.PropTypes.object.isRequired
    }
    constructor(props){
		super(props);
    this.state={
      stepIndex: 0,
      current_email:'',
      log_per_page_afterFirstPage:this.props.prestent_per_page,
      logList:[],
      emailList:[],
      emails:[]
    }
    this.onSelectingId=this.onSelectingId.bind(this)
	}

	componentWillMount(){
    }
    componentWillReceiveProps( props ){
    }
    onSelectingId(user_id){
      this.setState({
        stepIndex: 0,
        current_email:user_id,
        logList:[],
        emailList:[],
        emails:[]
      })

    }
	render(){
    let logs=this.props.log.logs
    _.map(logs,(log,i)=>{
      if(_.includes(this.state.emails,log.user_id)==false){
        this.state.emails.push(log.user_id)
        this.state.emailList.push(
             <MenuItem key={i} primaryText={log.user_id} onTouchTap={()=>this.onSelectingId(log.user_id)}/>
          );
       }
    }) 

    console.log(this.props.log.logs)
    const stepIndex = this.state.stepIndex;
    _.map(logs,(log,i)=>{
      if(this.state.current_email==''){
        console.log(log.user_id,"empty email")
        this.state.logList.push(
        <Step key={i}>
            <StepButton onTouchTap={() => this.setState({stepIndex: i})} style={{cursor:'pointer'}}>
              <div>{log.user_id}</div>&nbsp;&nbsp;&nbsp;
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
      }else{
        if(this.state.current_email==log.user_id){
          console.log(log.user_id,"NONempty email")
          this.state.logList.push(
        <Step key={i}>
            <StepButton onTouchTap={() => this.setState({stepIndex: i})} style={{cursor:'pointer'}}>
              <div>{log.user_id}</div>&nbsp;&nbsp;&nbsp;
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
      }
      
    })
        let next_page_num = this.props.log.next_page
        let next_page_link=<RaisedButton label="Load More" secondary={true} onTouchTap={ () =>{
          this.setState({
            stepIndex: 0,
            log_per_page_afterFirstPage:this.state.log_per_page_afterFirstPage+3,
            logList:[],
            emailList:[],
            emails:[],
            current_email:'',
          });
          this.props.pageChange(next_page_num,this.state.log_per_page_afterFirstPage)
        }}/>
        if( next_page_link == '' ){
            next_page_link=<RaisedButton label="Load More" secondary={true} onTouchTap={ () =>{
          this.setState({
            stepIndex: 0,
            log_per_page_afterFirstPage:this.state.log_per_page_afterFirstPage+3,
            logList:[],
            emailList:[],
            emails:[],
            current_email:'',
          });
          this.props.pageChange(next_page_num,this.state.log_per_page_afterFirstPage)
        }}/>
        }
		return(
      <div>
		<div style={{margin: 'auto',backgroundColor:'white',borderRadius:'3px',padding:'10'}}>
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
      <div style={{textAlign:'center',marginTop:'10px'}}>
        {next_page_link}
      </div>
      </div>
			);
	}
}

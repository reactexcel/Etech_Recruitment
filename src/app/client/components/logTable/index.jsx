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


export default class Login extends React.Component{
	static contextTypes={
			muiTheme:React.PropTypes.object.isRequired
    }
    constructor(props){
		super(props);
    this.state={
      stepIndex: 0,
      log_per_page_afterFirstPage:this.props.prestent_per_page
    }
	}

	componentWillMount(){
    }
    componentWillReceiveProps( props ){
    }
	render(){
    console.log(this.props.log.logs)
    const stepIndex = this.state.stepIndex;
		let logs=this.props.log.logs
    let logList=_.map(logs,(log,i)=>{
      return(
        <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: i})} style={{cursor:'pointer'}}>
              <div>{log.user_id}</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({log.created_on})</div>
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
        );
    })
        let next_page_num = this.props.log.next_page
        let next_page_link=<RaisedButton label="Load More" secondary={true} onTouchTap={ () =>{
          this.setState({
            log_per_page_afterFirstPage:this.state.log_per_page_afterFirstPage+3
          });
          this.props.pageChange(next_page_num,this.state.log_per_page_afterFirstPage)
        }}/>
        if( next_page_link == '' ){
            next_page_link=<RaisedButton label="Load More" secondary={true} onTouchTap={ () =>{
          this.setState({
            log_per_page_afterFirstPage:this.state.log_per_page_afterFirstPage+3
          });
          this.props.pageChange(next_page_num,this.state.log_per_page_afterFirstPage)
        }}/>
        }
		return(
      <div>
		<div style={{margin: 'auto',backgroundColor:'white',borderRadius:'3px',padding:'10'}}>
    <div style={{marginLeft:'4px'}}>
    <h4>Candidate Logs:</h4>
    </div>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          {logList}
        </Stepper>
      </div>
      <div style={{textAlign:'center',marginTop:'10px'}}>
        {next_page_link}
      </div>
      </div>
			);
	}
}

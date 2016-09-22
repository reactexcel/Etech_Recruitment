import React, {PropTypes} from 'react';
import {Router, browserHistory, withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import _ from 'lodash';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

class CandidateHistory extends React.Component {
	constructor(props) {
    super(props);
    
    }
    componentWillMount(){
    }
   
  
  render(){
    let history=this.props.candidateHistory.history;
    let historySteper=[]
    const self=this;
    if(history.length != 0){
      _.map(history[0].historyDetails,(hist,i)=>{
         if(hist.ignored){
          historySteper.push(
            <Step key={i} active={true}>
            <StepButton>
              <div>Ignored</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({moment(hist.date).format("DD-MM-YYYY HH:mm:ss")})</div>
            </StepButton>
            <StepContent>
              <div>
              <div style={{fontWeight:'bold'}}>
              Action performed by:{hist.actionPerformedBy}
              </div>
              <p>
                {hist.detail}
              </p>
              </div>
            </StepContent>
          </Step>
            )
         }
         if(hist.rejected){
          historySteper.push(
            <Step key={i} active={true}>
            <StepButton >
              <div>Rejected</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({moment(hist.date).format("DD-MM-YYYY HH:mm:ss")})</div>
            </StepButton>
            <StepContent>
            <div>
              <div style={{fontWeight:'bold'}}>
                Action performed by:{hist.actionPerformedBy}
              </div>
              <p>
                Reason of rejection:{hist.reason}
              </p>
              <p>
                {hist.detail}
              </p>
              </div>
            </StepContent>
          </Step>
            )
         }
         if(hist.scheduled){
          historySteper.push(
            <Step key={i} active={true}>
            <StepButton >
              <div>Scheduled</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({moment(hist.date).format("DD-MM-YYYY HH:mm:ss")})</div>
            </StepButton>
            <StepContent>
            <div>
              <div style={{fontWeight:'bold'}}>
                Action performed by:{hist.actionPerformedBy}
              </div>
              <p>
                {hist.detail}
              </p>
              </div>
            </StepContent>
          </Step>
            )
         }
         if(!hist.ignored && !hist.rejected && !hist.scheduled){
          historySteper.push(
            <Step key={i} active={true}>
            <StepButton>
              <div>{hist.action}</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({moment(hist.date).format("DD-MM-YYYY HH:mm:ss")})</div>
            </StepButton>
            <StepContent>
              <div>
              <div style={{fontWeight:'bold'}}>
              Action performed by:{hist.actionPerformedBy}
              </div>
              <p>
                {hist.detail}
              </p>
              </div>
            </StepContent>
          </Step>
            )
         }
          
      })
    }else{
      historySteper.push(<div>{this.props.candidateHistory.status_history}</div>)
    }
  	
  	return(
  	<div style={{backgroundColor:'white',borderRadius:'3px',padding:10}}>
    <div style={{fontSize:'x-large'}}>
        Candidate History:
        </div>
        <Stepper
          linear={false}
          orientation="vertical"
        >
        {historySteper}
        </Stepper>
      </div>
      );
  }

}
export default CandidateHistory
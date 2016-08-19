import React, {PropTypes} from 'react';
import { withRouter, Link } from 'react-router';
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
    this.state={
      stepIndex: 0
    }
    }
    handleNext = () => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex < 2) {
      this.setState({stepIndex: stepIndex + 1,current_history:[]});
    }
  };
  handlePrev = () => {
    const stepIndex = this.state.stepIndex;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1,current_history:[]});
    }
  };
  renderStepActions(step) {
    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label="Next"
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onTouchTap={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disableTouchRipple={true}
            disableFocusRipple={true}
            onTouchTap={this.handlePrev}
          />
        )}
      </div>
    );
  }
  render(){
  	const stepIndex = this.state.stepIndex;
  	return(
  	<div style={{backgroundColor:'white',borderRadius:'3px',padding:10}}>
    <div style={{fontSize:'x-large'}}>
        Candidate History:
        </div>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 0})}>
              <div>First Rount Interview</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>('01-11-2016')</div>
            </StepButton>
            <StepContent>
              <p>
                Details
              </p>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 1})}>
              <div>Machine Round</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>('05-11-2016')</div>
            </StepButton>
            <StepContent>
              <p>Details</p>
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: 2})}>
              <div>Hr Interview</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>('10-11-2016')</div>
            </StepButton>
            <StepContent>
              <p>
                Details
              </p>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
      );
  }

}
export default CandidateHistory
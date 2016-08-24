import React, {PropTypes} from 'react';
import {Router, browserHistory, withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import * as candidateHistory_action from '../../actions/candidateHistory'
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
      stepIndex: 0,
      historySteper:[]
    }
    }
    componentWillMount(){
        this.props.onLoadCandidateHistory(this.props.email_id)
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
    console.log(this.props.candidateHistory,"in renderrrrrrrrrrrrrrrrrrr")
    let history=this.props.candidateHistory.history;
    //let historySteper=''
    const self=this;
    const stepIndex = this.state.stepIndex;
    if(history.length != 0){
      console.log(history[0].historyDetails,"asdsddsadsadsad")
      _.map(history[0].historyDetails,(hist,i)=>{
         if(hist.ignored){
          this.state.historySteper.push(
            <Step key={i}>
            <StepButton onTouchTap={() => self.setState({stepIndex: i})}>
              <div>Ignored</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({moment(hist.date).format("DD-MM-YYYY")})</div>
            </StepButton>
            <StepContent>
              <p>
                {hist.detail}
              </p>
              {self.renderStepActions(i)}
            </StepContent>
          </Step>
            )
         }
         if(hist.rejected){
          this.state.historySteper.push(
            <Step key={i}>
            <StepButton onTouchTap={() => self.setState({stepIndex: i})}>
              <div>Rejected</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({moment(hist.date).format("DD-MM-YYYY")})</div>
            </StepButton>
            <StepContent>
              <p>
                Reason of rejection:{hist.reason}
              </p>
              <p>
                {hist.detail}
              </p>
              {self.renderStepActions(i)}
            </StepContent>
          </Step>
            )
         }
          
      })
    }
  	
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
        {this.state.historySteper}
        </Stepper>
      </div>
      );
  }

}
function mapStateToProps(state,props){
  state = state.toJS()

  return {
    candidateHistory:state.entities.candidateHistory
  }
}
const mapDispatchToProps=(dispatch)=>{
  return{
    onLoadCandidateHistory : (email_id) => {
            return dispatch( candidateHistory_action.onLoadCandidateHistory(email_id) )
        }
  }
}
export default withRouter(connect(
mapStateToProps,
mapDispatchToProps
)(CandidateHistory))
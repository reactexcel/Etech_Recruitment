import React, {PropTypes} from 'react';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import _ from 'lodash';
import * as history_action from '../../actions/candidateHistory';
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
      current_candidateId:'',
      current_history:[],
      CandidateList:[]
    }
    this.onSelectingCandidate=this.onSelectingCandidate.bind(this)
  }
  componentWillReceiveProps(props){
  }
  componentWillMount( ){
    this.props.onHistoryDate()
  }
  onSelectingCandidate(candidate_id){
    this.setState({
      stepIndex:0,
      current_candidateId:candidate_id,
      current_history:[],
      CandidateList:[]
    })
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
    let history = this.props.history.history
    let current_candidate='';
    if(history.length>0)
    {
    _.map(history,(hist,i)=>{
      this.state.CandidateList.push(
        <MenuItem key={i} primaryText={hist.candidate_name} onTouchTap={()=>this.onSelectingCandidate(hist.candidate_id)}/>
        );
    })
      if(this.state.current_candidateId==''){
         current_candidate=history[0].candidate_name
         _.map(history[0].action_details,(hist,i)=>{
            this.state.current_history.push(
              <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: i,current_history:[]})}>
              <div>{hist.action}</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({hist.created_on})</div>
            </StepButton>
            <StepContent style={{marginTop:5}}>
              <p>
                {hist.Details}
              </p>
              {this.renderStepActions(i)}
            </StepContent>
          </Step>
          )
         })
      }else{
        _.map(history,(hist,i)=>{
          if(this.state.current_candidateId==hist.candidate_id){
            current_candidate=hist.candidate_name
            _.map(hist.action_details,(value,index)=>{
              this.state.current_history.push(
                <Step>
            <StepButton onTouchTap={() => this.setState({stepIndex: index,current_history:[]})}>
              <div>{value.action}</div>&nbsp;&nbsp;&nbsp;
              <div style={{color:'#8c8c8c'}}>({value.created_on})</div>
            </StepButton>
            <StepContent style={{marginTop:5}}>
              <p>
                {value.Details}
              </p>
              {this.renderStepActions(index)}
            </StepContent>
          </Step>
              )
            })
          }
        })
      }
    }

    const stepIndex = this.state.stepIndex;
  	return(
      <div>
  		<div style={{margin: 10,backgroundColor:'white',borderRadius:'3px',padding:10}}>
  		  <div style={{marginLeft:4,fontSize:'x-large'}}>
        Candidate Name:{current_candidate}
        <IconMenu
        style={{float:'right'}}
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        {this.state.CandidateList}
      </IconMenu>
        </div>
        <Stepper
          activeStep={stepIndex}
          linear={false}
          orientation="vertical"
        >
         {this.state.current_history}
        </Stepper>
  		</div>
      </div>
  		);
  }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
      history:state.entities.history
    }
}
const mapDispatchToProps=(dispatch)=>{
    return {
      onHistoryDate : () => {
            return dispatch( history_action.getHistoryData() )
        }
      }
}
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CandidateHistory))
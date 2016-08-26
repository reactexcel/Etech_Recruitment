import React, {PropTypes} from 'react';
import { withRouter, Link } from 'react-router';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';
import List from 'material-ui/List'
import CandidateHistory from './candidateHistory'

import {Menu, MenuItem} from 'material-ui/Menu'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import _ from 'lodash';
import MyCard from './MyCard';

import LinearProgress from 'material-ui/LinearProgress';
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
        reason:'',
        errortxt:'',
        ignoreTagId:'',
        rejectTagId:'',
        message:'',
        messageDialog:false,
        show : true

    }
    this.handleClose=this.handleClose.bind(this)
    this.submitreason=this.submitreason.bind(this)
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
    _.map(props.inboxTag,(tag)=>{
      if(tag.name=="Ignore"){
        this.setState({
          ignoreTagId:tag._id
        })
      }
      if(tag.name=="Reject"){
        this.setState({
          rejectTagId:tag._id
        })
      }
    })

}


  handleClose(){
    this.setState({rejectpop: false,messageDialog:false});
  }
  submitreason(id){
    let reason = this.refs.reg.input.value.trim()
    if(reason.length > 0){
        this.props.onReject(id,this.state.rejectTagId,reason)
        this.props.onAddAction("Candidate is Rejected",Meteor.userId(),{"Action apply on candidate id" :id,"Reason of rejection":reason})
        this.handleClose()
    }else{
        this.setState({
            errortxt:'Reason required'
        })
    }
  }

render(){
  console.log(this.props.params.id,"hhhhhhhhhhhhhhh")
       let data = this.state.data;
       let more_email = typeof data.more_emails !== 'undefined'?data.more_emails.sort(function(a,b){if(a.email_timestamp > b.email_timestamp)return -1;if(a.email_timestamp < b.email_timestamp)return 1; else return 0;}):[];
       let ignoreText="Ignore";
       let rejectText="Reject";
       _.map(data.tags,(tagID)=>{
        if(tagID==this.state.ignoreTagId){
          ignoreText="Ignored"
        }
        if(tagID==this.state.rejectTagId){
          rejectText="Rejected"
        }
       })
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
            <div className="row" style={{ "margin": "0px", "position" : "relative"}}>
    <div className="col-xs-2" style={{ "padding": "0px", "backgroundColor": "#fff", "height": "100%", "position": "absolute"}}>

        <Menu desktop={true}>
            <MenuItem primaryText={ <Link to="inbox">Inbox</Link>
            } />
            <MenuItem primaryText="Trash" />
        </Menu>
    </div>
    <div className="col-xs-10" style={{ "float": "right"}}>
        <div style={{ "marginBottom": "50px", "marginTop": "-15px"}}>
            <nav aria-label="Page navigation">
                <ul className="pagination pull-right" style={{ "marginBottom": "6px"}}>
                    <li  onClick={ () => {
                      if(ignoreText=="Ignored"){
                        this.setState({message:"Already Ignored",messageDialog:true})
                      }
                      if(ignoreText=="Ignore"){
                        this.props.onIgnore(data._id,this.state.ignoreTagId),
                        this.props.onAddAction("Candidate is moved to ignore tag",Meteor.userId(),"Action apply on Candidate id : "+data._id)
                      }
                    }} style={{cursor:'pointer'}}><span aria-hidden="true" >{ignoreText}</span></li>
                    <li  onClick={ () => {
                      if(rejectText=="Reject"){
                        this.setState({rejectpop:true})
                      }else{
                        this.setState({message:"Already rejected",messageDialog:true})
                      }
                    }} style={{cursor:'pointer'}}><span aria-hidden="true">{rejectText}</span></li>
                    <li  onClick={ () => this.props.schedule(data._id)} style={{cursor:'pointer'}}><span aria-hidden="true">Schedule</span></li>
                </ul>
            </nav>
        </div>
        <Dialog
          title={this.state.message}
          modal={false}
          open={this.state.messageDialog}
          onRequestClose={this.handleClose}
        >
        </Dialog>
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
        <div className="row" style={{marginLeft:'4px',marginRight:'4px'}}>
          <div className="col-sm-12 col-sx-12 col-lg-12">
              {_.map(more_email,( email, i) => (
                  <MyCard email={email} i={i} key={i} />
              ))}
              <MyCard email={data} i={typeof data.more_emails !== 'undefined'?-1:0} />
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

    </div>
</div>
    )
}
}

export default EmailBody
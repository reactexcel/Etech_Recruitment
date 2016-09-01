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
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
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
        SnackbarOpen:false,
        SnackbarMessage:''

    }
    this.handleClose=this.handleClose.bind(this)
    this.submitreason=this.submitreason.bind(this)
    this.ignoreTagId = "";
    this.rejectTagId = '';
    this.ignoreText = 'Ignore';
    this.rejectText = 'Reject';
  }
componentWillMount(){
   _.map(this.props.inboxTag,(tag)=>{
      if(tag.name=="Ignore"){
          this.ignoreTagId = tag._id
      }
      if(tag.name=="Reject"){
          this.rejectTagId = tag._id
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


  handleClose(){
    this.setState({rejectpop: false});
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
        this.props.onReject([id],this.rejectTagId,reason)
        this.rejectText="Rejected"
        this.handleClose()
        this.props.router.push('/inbox');
    }else{
        this.setState({
            errortxt:'Reason required'
        })
    }
  }

render(){
       let data = this.state.data;
       let more_email = typeof data.more_emails !== 'undefined'?data.more_emails.sort(function(a,b){if(a.email_timestamp > b.email_timestamp)return -1;if(a.email_timestamp < b.email_timestamp)return 1; else return 0;}):[];
       if(_.includes(data.tags,this.ignoreTagId)==true){
                console.log(this.ignoreTagId,"ignored")
                this.ignoreText="Ignored"
        }
        if(_.includes(data.tags,this.rejectTagId)==true){
          console.log(this.rejectTagId,"rejected")
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
    iconElementLeft={<IconButton onTouchTap={() => {this.props.router.push('/inbox')}}><NavigationArrowBack /></IconButton>}
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText={this.ignoreText} onTouchTap={()=>{
                      if(_.includes(data.tags,this.ignoreTagId)==false){
                            this.ignoreText="Ignored";
                            this.props.onIgnore([data._id],this.ignoreTagId)
                            this.props.router.push('/inbox');
                      }else{
                        this.setState({
                          "SnackbarOpen":true,
                          "SnackbarMessage":"Candidates is already ignored"
                        })
                      }
                    }}/>
        <MenuItem primaryText={this.rejectText} onTouchTap={()=>{
                     if(_.includes(data.tags,this.rejectTagId)==false){
                        this.setState({rejectpop:true})

                      }else{
                        this.setState({
                          "SnackbarOpen":true,
                          "SnackbarMessage":"Candidates is already rejected"
                        })
                      }
        }}/>
        <MenuItem primaryText="Schedule" onTouchTap={()=>this.props.schedule(data._id)}/>
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

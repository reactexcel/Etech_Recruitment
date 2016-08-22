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
        attachmentlink:'',
        bodysec:'col-xs-12',
        attchsec:'hidden',
        rejectpop:false,
        reason:'',
        errortxt:'',
        ignoreTagId:'',
        rejectTagId:'',
        message:'',
        messageDialog:false

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
            if(typeof email.attachments != 'undefined'){
                this.setState({
                    attachmentlink:email.attachments[0].link,
                    bodysec:'col-xs-6',
                    attchsec:'col-xs-6',
                })
            }
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
  console.log(this.props);
       let data = this.state.data;
       let more_email = typeof data.more_emails !== 'undefined'?data.more_emails.sort(function(a,b){if(a.email_timestamp > b.email_timestamp)return -1;if(a.email_timestamp < b.email_timestamp)return 1; else return 0;}):[];
       console.log(more_email);
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
    <div className="col-xs-1" style={{ "padding": "0px", "backgroundColor": "#fff", "height": "100%", "position": "absolute"}}>
        <Menu desktop={true}>
            <MenuItem primaryText={ <Link to="inbox">Inbox</Link>
            } />
            <MenuItem primaryText="Trash" />
        </Menu>
    </div>
    <div className="col-xs-11" style={{ "float": "right"}}>
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
                <Card key={i}>
                <Paper
                  style={{marginTop:"5px"}}
                  actAsExpander={i==0?false:true}
                  zDepth={2}
                  children={
                    <CardHeader
                      title={"From : "+ data.from }
                      subtitle={"Email : "+ data['sender_mail'] + "( "+moment(email.email_timestamp* 1000).format("DD/ MM/ YYYY - HH:MM")+" )" }
                      avatar={<Avatar size={40} children={(data.from || "" ).charAt(0)} />}
                      actAsExpander={i==0?false:true}
                      showExpandableButton={i==0?false:true}
                      />
                  }
                   />
                    <CardText
                      expandable={i==0?false:true}
                      children={
                          <div className="row">
                              <div className={this.state.bodysec} dangerouslySetInnerHTML={{__html:data.body }}></div>
                              <div className={this.state.attchsec} style={{height: '100vh'}}>
                                  <iframe src={this.state.attachmentlink} style={{height: '100%',width: '100%',border: 'none'}} scrolling="no"></iframe>
                              </div>
                          </div>
                    }
                      >
                    </CardText>

                </Card>
              ))}
              <Card>
              <Paper
                style={{marginTop:"5px"}}
                actAsExpander={typeof data.more_emails === 'undefined'?false:true}
                zDepth={2}
                children={
                  <CardHeader
                    title={"From : "+ data.from }
                    subtitle={"Email : "+ data['sender_mail'] + " ("+moment(data.email_timestamp* 1000).format("DD/ MM/ YYYY - HH:MM")+")" }
                    avatar={<Avatar size={40} children={(data.from || "" ).charAt(0)} />}
                    actAsExpander={typeof data.more_emails === 'undefined'?false:true}
                    showExpandableButton={typeof data.more_emails === 'undefined'?false:true}
                    />
                }
                 />
                <CardText
                    expandable={typeof data.more_emails === 'undefined'?false:true}
                    children={
                        <div className="row">
                            <div className={this.state.bodysec} dangerouslySetInnerHTML={{__html:data.body }}></div>
                            <div className={this.state.attchsec} style={{height: '100vh'}}>
                                <iframe src={this.state.attachmentlink} style={{height: '100%',width: '100%',border: 'none'}} scrolling="no"></iframe>
                            </div>
                        </div>
                  }
                >
                </CardText>

              </Card>
          </div>
        </div>

        <div className="row" style={{marginTop:'5px',marginBottom:'10px',marginLeft:'4px',marginRight:'4px'}}>
          <div className="col-sm-12 col-sx-12 col-lg-12">
        <CandidateHistory id={this.props.params.id}/>
        </div>
        </div>

    </div>
</div>
    )
}
}

export default EmailBody



/*


<Card>
  <CardHeader
    title={"From : "+ data.from }
    subtitle={"Email : "+ data['sender_mail']}
    avatar={<Avatar size={40} children={(data.from || "" ).charAt(0)} />}
    actAsExpander={true}
    showExpandableButton={true}
    />
  <CardText
    expandable={true}
    children={<div dangerouslySetInnerHTML={{__html:data.body }}></div>}
    >
  </CardText>
</Card>






<div className="col-xs-12">
    <div className='row' style={{background: '#fff'}}>

        <div className="col-xs-12" style={{background: 'antiquewhite',padding: '10px',borderBottom: '1px solid gainsboro'}}>
            <div className="col-xs-6">
                From : <b>{data.from}</b> <br /> Sender email : <b>{data['sender-mail']} </b>
            </div>
            <div className="col-xs-6" style={{textAlign: "right"}} dangerouslySetInnerHTML={{__html: data.email_date }}>
            </div>
        </div>
        <div className="col-xs-12" style={{fontSize: '20px',padding: "10px 20px 20px",borderBottom: '1px solid gainsboro'}}>
            {data.subject}
        </div>
        <div className="col-xs-12" style={{marginBottom: '15px',borderBottom: '1px solid gainsboro'}}>
            <div className="row">
                <div className={this.state.bodysec} dangerouslySetInnerHTML={{__html:data.body }}>

                </div>
                <div className={this.state.attchsec} style={{height: '100vh'}}>
                    <iframe src={this.state.attachmentlink} style={{height: '100%',width: '100%',border: 'none'}} scrolling="no"></iframe>
                </div>
            </div>
        </div>

    </div>
</div>
*/

import Paper from 'material-ui/Paper';
import React, {PropTypes} from 'react';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';


export default class MyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      show: true,
      prog:'show'
    }
  }
  componentWillReceiveProps( props ){
    if(typeof this.props.index !== 'undefined'){
      if(this.props.index == 0 || this.props.index == "done"){
        this.setState({
          prog:{marginTop:'7px'}
        })
      }else{
        this.setState({
          prog:{marginTop:'7px',opacity:'-1'}
        })
      }
    }
  }

  render() {
      let email = this.props.email;
      let i = this.props.i;
      let progresStatus = '';
      let progressValue = '';
      let progresColor = '';
      if(typeof this.props.progresStatus !== 'undefined'){
        progresStatus = this.props.progresStatus
      }else{
        progresStatus = 0
      }
      if(progresStatus == 1){
        progressValue = '25'
        progresColor = '#CF0649'
      }else if(progresStatus == 2){
        progressValue = '50'
        progresColor = '#751F07'
      }else if(progresStatus == 3){
        progressValue= '75'
        progresColor = '#02187A'
      }else if(progresStatus == 4){
        progressValue = '100'
        progresColor = '#038503'
      }else{
        progressValue = '0'
        //progresColor = ''
      } 
      return (
        <Card>
        <Paper
          style={{marginTop:"5px",paddingBottom: "0px"}}
          actAsExpander={i==0?false:true}
          zDepth={2}
          children={
            <CardHeader
              title={<div> <span>{this.props.progresHide}</span>{typeof email.from == 'undefined'?<LinearProgress mode="indeterminate" color="gray" style={{"height":"9px", width:"150px", backgroundColor:"lightgray", borderRadius:"10px 10px"}} />:<div>{email.subject} <br/> From: {email.from}</div>} </div>}
              subtitle={<div> {typeof email.sender_mail == 'undefined'?
                <div>
                  <LinearProgress mode="indeterminate" color="gray" style={{"height":"9px", width:"100px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                  <LinearProgress mode="indeterminate" color="gray" style={{"height":"9px", width:"200px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                </div>:
                <div style={{"width":"100%"}}>
                  Email: {email.sender_mail + " ("+moment(email.email_timestamp* 1000).format("DD/ MM/ YYYY - HH:MM")+")"}
                </div>
                } 
                </div>}
              avatar={<Avatar size={40} children={(email.from || "" ).charAt(0)} />}
              actAsExpander={i==0?false:true}
              showExpandableButton={i==0?false:true}
              titleStyle={{'fontSize':"12px"}}
              subtitleStyle={{'fontSize':"11px"}}
              children={<div style={typeof email.attachments !== 'undefined'?{marginTop:"-35px"}:{marginTop:'0px'}}>
                <div style={{float:'right',display:'block',position:'relative',marginBottom:'25px'}}>{typeof email.attachments == 'undefined'?"":<span ><i className="fa fa-paperclip fa-2x"></i></span>}</div>
                <div><LinearProgress color={progresColor} mode="determinate" value={progressValue} min='0' max='100' style={this.state.prog}/></div></div>}
              />
          }
           />
            <CardText
              expandable={i==0?false:true}
              children={
                  <div className="row">
                      <div className={typeof email.attachments == 'undefined'?"col-sm-12":"col-sm-5"} dangerouslySetInnerHTML={{__html: email.body }}></div>
                      <div className={typeof email.attachments == 'undefined'?"hidden":"col-sm-7"} style={{height: '100vh'}}>
                        {this.state.show?<LinearProgress mode="indeterminate" />:""}
                          <iframe
                            src={typeof email.attachments == 'undefined'?'':email.attachments[0].link}
                            style={{height: '100%',width: '100%',border: 'none'}}
                            scrolling="no"
                            onLoad={(e) => this.setState({show:false})}
                            ></iframe>
                      </div>
                  </div>
                }
              >
            </CardText>
        </Card>
    );
  }
}

MyCard.propTypes = {
};

import Paper from 'material-ui/Paper';
import React, {PropTypes} from 'react';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';


export default class MyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      show: true
    }
  }

  render() {
      let email = this.props.email;
      let i = this.props.i;
      return (
        <Card>
        <Paper
          style={{marginTop:"5px",paddingBottom: "0px"}}
          actAsExpander={i==0?false:true}
          zDepth={2}
          children={
            <CardHeader
              title={<div> {typeof email.from == 'undefined'?<LinearProgress mode="indeterminate" color="gray" style={{"height":"9px", width:"150px", backgroundColor:"lightgray", borderRadius:"10px 10px"}} />:<div>{email.subject} <br/> From: {email.from}</div>} </div>}
              subtitle={<div> {typeof email.sender_mail == 'undefined'?
                <div>
                  <LinearProgress mode="indeterminate" color="gray" style={{"height":"9px", width:"100px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                  <LinearProgress mode="indeterminate" color="gray" style={{"height":"9px", width:"200px", backgroundColor:"lightgray", borderRadius:"10px 10px","marginTop": "10px"}} />
                </div>:
                <div style={{"width":"100%"}}>
                  Email: {email.sender_mail + " ("+moment(email.email_timestamp* 1000).format("DD/ MM/ YYYY - HH:MM")+")"}
                  {typeof email.attachments == 'undefined'?"":<span className="pull-right" style={{"height":"10px",marginLeft:"20px"}}><i className="fa fa-paperclip fa-2x"></i></span>}
                </div>
                } </div>}
              avatar={<Avatar size={40} children={(email.from || "" ).charAt(0)} />}
              actAsExpander={i==0?false:true}
              showExpandableButton={i==0?false:true}
              titleStyle={{'fontSize':"12px"}}
              subtitleStyle={{'fontSize':"11px"}}
              />
          }
           />
            <CardText
              expandable={i==0?false:true}
              children={
                  <div className="row">
                      <div className={typeof email.attachments == 'undefined'?"col-sm-12":"col-sm-8"} dangerouslySetInnerHTML={{__html: email.body }}></div>
                      <div className={typeof email.attachments == 'undefined'?"hidden":"col-sm-4"} style={{height: '100vh'}}>
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

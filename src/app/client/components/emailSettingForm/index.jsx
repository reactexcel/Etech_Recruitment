import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';

const style={
  "formInput":{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "40%"
  },
  "formButton":{
    "marginTop": "2%",
    "marginLeft": "5%"
  }
}

export default class EmailSettingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "emailId": this.props.emailSetting.emailId || "",
      "password": this.props.emailSetting.password || "",
      "server": this.props.emailSetting.server || "",
      "port": this.props.emailSetting.port || "",
      "encrypt": this.props.emailSetting.encrypt || "",
      "_id": this.props.emailSetting._id || undefined,
      "status": this.props.emailSetting.status || 0,
      "label": "Save",
      "edit": 0,
      "disable":false,
      "open" : false,
      "title": "",
      show:false,
    }
    this.error = [];
    this.saveSettings = this.saveSettings.bind(this);
    this.update = this.update.bind(this);
    this.clear = this.clear.bind(this);
    this.regExp= {
      "port" : /^[0-9]+$/,
      "emailId": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "password": /^[a-zA-Z0-9\.-_!@#$%^&*]+$/,
      "server": /^[a-z]+[.][a-z]+[.][a-z]+$/,
      "encrypt": /^[a-z]+$/
    }
    this.update = this.update.bind(this);
    this.clear = this.clear.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.testDetails = this.testDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleOpen (email) {
    this.setState({
      "open" : true,
      "title": "Testing for Email: "+ email,
    });
  };

  handleClose () {
    this.setState({
      "open" : false,
      "title": "",
    });
  };
  update(row, label) {
    this.setState({
      "emailId": row.emailId || "",
      "password": row.password || "",
      "server": row.server || "",
      "port": row.port || "",
      "encrypt": row.encrypt || "",
      "_id": row._id || undefined,
      "status": row.status || 0,
      "label": label,
      "edit": 1,
      "disable":true,
      testStatus: false
    })
    this.error = [];
  }

  clear() {
    this.setState({
      "emailId": "",
      "password": "",
      "server": "",
      "port": "",
      "encrypt": "",
      "_id": undefined,
      "label": "Save",
      "status": this.state.status,
      "edit": 0,
      "disable":false,
    })
  }

  saveSettings () {
    this.setState({testDetails: true})
    if ((this.state.emailId.length && this.state.password.length
          && this.state.port.length && this.state.server.length
            && this.state.encrypt.length)){
        this.testDetails();
      if(this.state.edit == 1){
        this.props.logging("Edit email information",
          Meteor.userId(), "edited information of email id : "+this.state.emailId)
      }else if (this.state.edit == 0){
        this.props.logging("New eamil server added",
          Meteor.userId(), "New server email id : "+this.state.emailId)
      }
    }
  }

  componentWillUpdate () {
    if(this.props.uiLoading && this.state.open){
      this.handleClose () ;
    }
  }

  testDetails () {
    if ((this.state.emailId.length && this.state.password.length
          && this.state.port.length && this.state.server.length
            && this.state.encrypt.length)){
     this.handleOpen(this.state.emailId);
     this.props.onTestDetails({
      "emailId": this.state.emailId ,
      "password": this.state.password ,
      "server": this.state.server ,
      "port": this.state.port ,
      "encrypt": this.state.encrypt,
      "status": 0,
      status_last_fetch_details: '',
        "_id": this.state._id || undefined
      }).then((data)=> {
      if(data == -1){
        this.setState({testDetails: false})
        if(window.confirm(" Given information is incorrect do you stil want to save ?"))
          this.props.onSaveSettings({
            "emailId": this.state.emailId ,
            "password": this.state.password ,
            "server": this.state.server ,
            "port": this.state.port ,
            "encrypt": this.state.encrypt,
            "status": 0,
            "_id": this.state._id || undefined
          });
          this.setState({status: data, testDetails: true})
        }else {
          this.setState({testDetails: true})
          this.props.onSaveSettings({
            "emailId": this.state.emailId ,
            "password": this.state.password ,
            "server": this.state.server ,
            "port": this.state.port ,
            "encrypt": this.state.encrypt,
            "status": 0,
            "_id": this.state._id || undefined
          })
          this.setState({status: data, testDetails: true})
        }
        this.clear();
      })
    }else{
      //console.log("enter all cresentials");
    }
  }

  render() {
    const actions = [
      <RaisedButton
        label="Stop"
        onTouchTap={this.handleClose}
        style={{marginRight:10}}
      />
    ];
    return (
      <div className="row">
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12" >
          <Paper zDepth={2} style={{"padding":"20px"}}>
            <h4 className="h4" style={{"fontWeight": "bold"}}>IMAP/POP3 server </h4>
            <form className="form-inline" onSubmit={(e) => e.priventDefault()}>
              <div className="form-group" style={style.formInput}>
                <TextField
                  type="text"
                  floatingLabelText="Email"
                  hintText="Your email Id"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"emailId": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.emailId = "Enter a email id";
                      }else if (!this.regExp.emailId.test(evt.target.value)) {
                        this.error.emailId = "invalid email id";
                      }else{
                        this.error.emailId = "";
                      }
                    }
                  }
                  errorText={this.error.emailId}
                  value={this.state.emailId}
                  disabled={this.state.disable}
                />
              </div>
              <div className="form-group" style={style.formInput}>
                <TextField
                  type="text"
                  floatingLabelText="Password"
                  hintText="Password"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"password": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.password = "Enter a password";
                      }else if (!this.regExp.password.test(evt.target.value)) {
                        this.error.password = "invalid password";
                      }else{
                        this.error.password = "";
                      }
                    }
                  }
                  errorText={this.error.password}
                  value={this.state.password}
                />
              </div>
              <div className="form-group" style={style.formInput}>
                <TextField
                  type="text"
                  floatingLabelText="IMAP Server"
                  hintText="e.g. imap.host.com"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"server": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.server = "Enter mail server";
                      }else if (!this.regExp.server.test(evt.target.value)) {
                        this.error.server = "invalid server";
                      }else{
                        this.error.server = "";
                      }
                    }
                  }
                  errorText={this.error.server}
                  value={this.state.server}
                />
              </div>
              <div className="form-group" style={style.formInput}>
                <TextField
                  type="text"
                  floatingLabelText="Server port"
                  hintText="e.g. 0000"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"port": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.port = "Enter port number";
                      }else if (!this.regExp.port.test(evt.target.value)) {
                        this.error.port = "invalidport number";
                      }else{
                        this.error.port = "";
                      }
                    }
                  }
                  errorText={this.error.port}
                  value={this.state.port}
                />
              </div>
              <div className="form-group" style={style.formInput}>
                <RadioButtonGroup name="encrypt" valueSelected={this.state.encrypt} labelPosition="right"
                  style={{maxWidth: 250}}
                    onChange={
                      (evt, value) =>{
                        this.setState({"encrypt": value});
                        if ( typeof value == "undefined" ) {
                          this.error.encrypt = "encrypt is required";
                        }else{
                          this.error.encrypt = "";
                        }
                      }
                    }>
                  <RadioButton labelStyle={{fontWeight:"normal"}}
                    value="ssl"
                    label="SSL"
                    />
                  <RadioButton labelStyle={{fontWeight:"normal"}}
                    value="tls"
                    label="TLS"
                    />
                </RadioButtonGroup>
              </div>
              <div className="form-group" style={style.formButton}>
                <RaisedButton
                  label={this.state.label}
                  primary={true}
                  onClick={this.saveSettings}
                />
              </div>
              <div className="form-group" style={style.formButton}>
                <RaisedButton
                  label={'Test'}
                  secondary={true}
                  onClick={this.testDetails}
                />
              </div>
            </form>
          </Paper>
          <Snackbar
            open={this.state.testDetails}
            message={!this.props.uiLoading ?"": "Done!"}
            autoHideDuration={2000}
            onRequestClose = { () =>{ this.setState({testDetails:false})}}
            />
        </div>
        <div>
          <Dialog
            title={this.state.title}
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
            children={
              <CircularProgress size={1} />
            }
            bodyStyle={{marginLeft: "35%",borderRadius: " 100px", border:"1px solid transparent"}}
            titleClassName = "text-center text-muted"
            titleStyle={{"color": "#666"}}
            contentStyle={{width: "30%", borderRadius: "100px", border:"1px solid transparent" }}
            ></Dialog>
        </div>
      </div>
    );
  }
}

EmailSettingForm.propTypes = {
  onSaveSettings: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

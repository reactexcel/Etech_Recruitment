import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

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

export default class SendEmailSettingForm extends React.Component {
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
  }

  update(row, label) {
    
    this.setState({
      "emailId": row.smtp.emailId || "",
      "password": row.smtp.password || "",
      "server": row.smtp.server || "",
      "port": row.smtp.port || "",
      "encrypt": row.smtp.encrypt || "",
      "_id": row._id || undefined,
      "status": row.smtp.status || 0,
      "label": label,
      "edit": 1,
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
    })
  }

  saveSettings () {
    if ((this.state.emailId.length && this.state.password.length
          && this.state.port.length && this.state.server.length
            && this.state.encrypt.length)){
      this.props.onSaveSettings({
        "emailId": this.state.emailId ,
        "password": this.state.password ,
        "server": this.state.server ,
        "port": this.state.port ,
        "encrypt": this.state.encrypt,
        "status": 0,
        "_id": this.state._id || undefined
      });
      if(this.state.edit == 1){
        this.props.logging("Edit email information",
          Meteor.userId(), "edited information of email id : "+this.state.emailId)
      }else if (this.state.edit == 0){
        this.props.logging("New eamil server added",
          Meteor.userId(), "New server email id : "+this.state.emailId)
      }
      this.clear();
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12" >
          <Paper zDepth={2} style={{"padding":"20px"}}>
            <h4 className="h4" style={{"fontWeight": "bold"}}>SMTP server </h4>
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
                  floatingLabelText="SMTP Server"
                  hintText="e.g. smtp.host.com"
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
                <RadioButtonGroup name="encrypt" labelPosition="right"
                  style={{maxWidth: 250}}
                    onChange={
                      (evt, value) =>{
                        console.log(value);
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
            </form>
          </Paper>
        </div>
      </div>
    );
  }
}

SendEmailSettingForm.propTypes = {
  onSaveSettings: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

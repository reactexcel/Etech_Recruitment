import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
<<<<<<< HEAD
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
=======
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0

export default class EmailSettingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "emailId": this.props.emailSetting.emailId || "",
      "password": this.props.emailSetting.password || "",
      "server": this.props.emailSetting.server || "",
      "port": this.props.emailSetting.port || "",
      "encrypt": this.props.emailSetting.encrypt || "",
<<<<<<< HEAD
      "_id": this.props.emailSetting._id || undefined,
      "label": "Save"
=======
      "_id": this.props.emailSetting._id || undefined
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
    }
    this.error = [];
    this.saveSettings = this.saveSettings.bind(this);
    this.update = this.update.bind(this);
<<<<<<< HEAD
    this.clear = this.clear.bind(this);
=======
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
    this.regExp= {
      "port" : /^[0-9]+$/,
      "emailId": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "password": /^[a-zA-Z0-9\.-_!@#$%^&*]+$/,
      "server": /^[a-z]+[.][a-z]+[.][a-z]+$/,
      "encrypt": /^[a-z]+$/
    }
  }

<<<<<<< HEAD
  update(row, label) {
=======
  update(row) {
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
    this.setState({
      "emailId": row.emailId || "",
      "password": row.password || "",
      "server": row.server || "",
      "port": row.port || "",
      "encrypt": row.encrypt || "",
<<<<<<< HEAD
      "_id": row._id || undefined,
      "label": label
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
      "label": "Save"
    })
  }

=======
      "_id": row._id || undefined
    })
    this.error = [];
  }
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
  saveSettings () {
    if (this.state.emailId.length && this.state.password.length
          && this.state.port.length && this.state.server.length
            && this.state.encrypt.length){
      this.props.onSaveSettings({
        "emailId": this.state.emailId ,
        "password": this.state.password ,
        "server": this.state.server ,
        "port": this.state.port ,
        "encrypt": this.state.encrypt,
<<<<<<< HEAD
        "_id": this.state._id || undefined
      });
      this.clear();
    }else{
      this.props.snackbarOpen("Please fill all fields properly");
=======
        "_id": this.props.emailSetting._id || undefined
      });
      this.setState({
        "emailId": "",
        "password": "",
        "server": "",
        "port": "",
        "encrypt": "",
        "_id": undefined
      })
      this.props.snackbarOpen("We Catch your changes");
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
    }
  }

  render() {
    return (
      <div className="row">
<<<<<<< HEAD
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12" >
          <Paper zDepth={2} style={{"padding":"20px"}}>
            <h4 className="h4">IMAP/POP3 server </h4>
            <form className="form-inline">
              <div className="form-group" style={style.formInput}>
                <TextField
                  type="text"
                  floatingLabelText="Email"
=======
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12 well well-lg">
          <Paper zDepth={2} style={{"padding":"20px"}}>
            <h4 className="h4 text-center">Enter email server details </h4>
            <form>
              <div>
                <TextField
                  type="text"
                  floatingLabelText="Username"
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
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
<<<<<<< HEAD
              <div className="form-group" style={style.formInput}>
=======
              <div>
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
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
<<<<<<< HEAD
              <div className="form-group" style={style.formInput}>
=======
              <div>
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
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
<<<<<<< HEAD
              <div className="form-group" style={style.formInput}>
=======
              <div>
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
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
<<<<<<< HEAD
              <div className="form-group" style={style.formInput}>
=======
              <div>
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
                <TextField
                  type="text"
                  floatingLabelText="encrypt"
                  hintText="ssl/stl"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
<<<<<<< HEAD
                      this.setState({"Encrypt": evt.target.value});
=======
                      this.setState({"encrypt": evt.target.value});
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
                      if (!evt.target.value.length > 0 ) {
                        this.error.encrypt = "encrypt is required";
                      }else if (!this.regExp.encrypt.test()) {
                        this.error.encrypt = "invalid encrypt";
                      }else{
                        this.error.encrypt = "";
                      }
                    }
                  }
                  errorText={this.error.encrypt}
                  value={this.state.encrypt}
                />
              </div>
<<<<<<< HEAD
              <div className="form-group" style={style.formButton}>
                <RaisedButton
                  label={this.state.label}
                  primary={true}
                  onClick={this.saveSettings}
                />
              </div>
              <div className="form-group" style={style.formButton}>
                <RaisedButton
                  type="reset"
                  label="Clear"
                  secondary={true}
                  onClick={this.clear}
                />
              </div>
=======
              <div>
                <RaisedButton
                  backgroundColor="#a4c639"
                  labelColor="#444"
                  icon={<FontIcon className="fa fa-floppy-o fa-2x"/>}
                  style={
                    {
                      "marginTop": "2%"
                    }
                  }
                  onClick={this.saveSettings}
                />
              </div>
>>>>>>> 6b8c84a997434bcb13a1e8a729ee38c819e486c0
            </form>
          </Paper>
        </div>
      </div>
    );
  }
}

EmailSettingForm.propTypes = {
  onSaveSettings: PropTypes.func.isRequired,
  snackbarOpen: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

export default class EmailSettingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "emailId": this.props.emailSetting.emailId || "",
      "password": this.props.emailSetting.password || "",
      "server": this.props.emailSetting.server || "",
      "port": this.props.emailSetting.port || "",
      "encrypt": this.props.emailSetting.encrypt || "",
      "_id": this.props.emailSetting._id || undefined
    }
    this.error = [];
    this.saveSettings = this.saveSettings.bind(this);
    this.update = this.update.bind(this);
    this.regExp= {
      "port" : /^[0-9]+$/,
      "emailId": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "password": /^[a-zA-Z0-9\.-_!@#$%^&*]+$/,
      "server": /^[a-z]+[.][a-z]+[.][a-z]+$/,
      "encrypt": /^[a-z]+$/
    }
  }

  update(row) {
    this.setState({
      "emailId": row.emailId || "",
      "password": row.password || "",
      "server": row.server || "",
      "port": row.port || "",
      "encrypt": row.encrypt || "",
      "_id": row._id || undefined
    })
    this.error = [];
  }
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
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12 well well-lg">
          <Paper zDepth={2} style={{"padding":"20px"}}>
            <h4 className="h4 text-center">Enter email server details </h4>
            <form>
              <div>
                <TextField
                  type="text"
                  floatingLabelText="Username"
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
              <div>
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
              <div>
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
              <div>
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
              <div>
                <TextField
                  type="text"
                  floatingLabelText="encrypt"
                  hintText="ssl/stl"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"encrypt": evt.target.value});
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

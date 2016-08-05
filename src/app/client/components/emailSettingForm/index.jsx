import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

export default class EmailSettingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "emailId": this.props.emailId || "",
      "password": this.props.password || "",
      "server": this.props.server || "",
      "port": this.props.port || "",
      "encrpyt": this.props.encrpyt || ""
    }
    this.error = [];
    this.onEmailSettingSave = this.onEmailSettingSave.bind(this);
  }

  onEmailSettingSave () {

  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-xs-12 col-md-4 col-lg-6 well well-lg">
          <Paper zDepth={2} style={{"padding":"20px"}}>
            <span className="close pull-right" title="Delete it">&times;</span>
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
                  type="password"
                  floatingLabelText="Password"
                  hintText="Password"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"password": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.password = "Enter a password";
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
                  floatingLabelText="Encrpyt"
                  hintText="ssl/stl"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"encrpyt": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.encrpyt = "Encrpyt is required";
                      }else{
                        this.error.encrpyt = "";
                      }
                    }
                  }
                  errorText={this.error.encrpyt}
                  value={this.state.encrpyt}
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
                  onClick={this.OnSaveSettings}
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
  onFetchSettings: PropTypes.func.isrequired,
  OnSaveSettings: PropTypes.func.isrequired,
  emailSetting: PropTypes.array.isrequired,
};

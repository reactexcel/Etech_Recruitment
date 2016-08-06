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
      "encrypt": this.props.emailSetting.encrypt || ""
    }
    this.error = [];
    this.saveSettings = this.saveSettings.bind(this);
  }

  saveSettings () {
      this.props.onSaveSettings({
        "emailId": this.state.emailId ,
        "password": this.state.password ,
        "server": this.state.server ,
        "port": this.state.port ,
        "encrypt": this.state.encrypt,
        "_id": this.props.emailSetting._id || undefined
      });
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
                  type="text"
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
                  floatingLabelText="encrypt"
                  hintText="ssl/stl"
                  fullWidth={true}
                  onChange={
                    (evt) =>{
                      this.setState({"encrypt": evt.target.value});
                      if (!evt.target.value.length > 0 ) {
                        this.error.encrypt = "encrypt is required";
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
  emailSetting: PropTypes.any.isRequired,
};

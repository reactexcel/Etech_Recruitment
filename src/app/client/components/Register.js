import React from 'react';
import { router } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';


export default class Register extends React.Component {
  static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    this.state = {
      errorEmail: '',
      errorName: '',
      errorPass: '',
      errorCpass: '',
      email: '',
      name:'',
      password: '',
      conf_password: '',
      snackbarOpen:false,
      snackbarmsg:''
    }
    this.goBack = this.goBack.bind(this)
    this.signup = this.signup.bind(this)
  }
  componentWillMount(){
    let self = this
    Meteor.autorun(function(c) {
      self.autorun = c;
      if (Meteor.userId()) {
        self.props.router.push('/user')
        c.stop() //only run this one time
      }  
    });    
  }
  componentWillUnmount(){
    this.autorun.stop()
  }
  signup(){
    let email = this.state.email.trim()
    let name = this.state.name.trim()
    let password = this.state.password.trim()
    let emailValid = true
    if(email == ""){
      this.setState({
        errorEmail:"Email required"
      })
    }else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)){
      this.setState({
        errorEmail:"Enter a valid email"
      })
      emailValid = false
    }else{
      this.setState({
        errorEmail:''
      })
      emailValid = true
    } 
    if(name == ""){
      this.setState({
        errorName:"Name required"
      })
    }else{
      this.setState({
        errorName:""
      })
    } 
    if(password == ""){
      this.setState({
        errorPass:"Password required"
      })
    }else{
      this.setState({
        errorPass:""
      })
    }
    if(password !== this.state.conf_password){
      this.setState({
        errorCpass:"Password do not match"
      })
    }else{
      this.setState({
        errorCpass:""
      })
    }

    if(email != '' && emailValid = true && name != '' && password != '' && password == this.state.conf_password){
      this.props.onRegisterUser(email, name, password).then( () => {
        this.setState({
          email: '',
          name:'',
          password: '',
          conf_password : '',
          snackbarOpen:true,
          snackbarmsg:"You have registered successfully"
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString()
        })
      })
    }
  }
  handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
  goBack(){
    this.props.router.push('/login')
  }
  render() {
    return (
        <MuiThemeProvider>
          <div>
            <AppBar
              title={"Register"} 
              iconElementRight={<FlatButton label="Back" onTouchTap={this.goBack} />}
            />
            <div style={{textAlign: 'center'}}>
                <div style={{width: 320, margin: '0px auto', paddingTop: 20}}>
                    
              <div style={{width: 320, margin: '0px auto', paddingTop: 20}}>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({email: evt.target.value}) }}
                        value={this.state.email}
                        errorText={this.state.errorEmail}
                        floatingLabelText="Email" />
                    </div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({name: evt.target.value}) }}
                        value={this.state.name}
                        errorText={this.state.errorName}
                        floatingLabelText="Name" />
                    </div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({password: evt.target.value}) }}
                        type="password"
                        value={this.state.passowrd}
                        errorText={this.state.errorPass}
                        floatingLabelText="Password" />
                    </div>

                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({conf_password: evt.target.value}) }}
                        type="password"
                        value={this.state.conf_password}
                        errorText={this.state.errorCpass}
                        floatingLabelText="Confirm Password" />
                    </div>
                    <br />
                    <div style={{textAlign: 'center'}}>
                      <RaisedButton label="SIGNUP" primary={true} onTouchTap={this.signup} />
                    </div>

                </div>

                  <Snackbar
                      open={this.state.snackbarOpen}
                      message={this.state.snackbarmsg}
                      autoHideDuration={5000}
                      onRequestClose={this.handleRequestClose}
                  />
                </div>
            </div>
          </div>
        </MuiThemeProvider>
  );
}
};

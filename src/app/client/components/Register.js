import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';



export default class Register extends React.Component {
  static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    this.state = {
      email: '',
      name:'',
      password: '',
      conf_password: ''
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
    if(email == ""){
      alert("Email required")
    }else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)){
      alert("Please enter a valid email")
    }else if(name == ""){
      alert("name required")
    }else if(password == ""){
      alert("password required")
    }else if(password !== this.state.conf_password){
      alert("Password do not match")
    }else{
      this.props.onRegisterUser(email, name, password).then( () => {
        this.setState({
          email: '',
          name:'',
          password: '',
          conf_password : ''
        })
      }).catch( (error) => {
        //console.log(error)
          alert(error.toString())
      })
    }
  }
  goBack(){
    alert("goBack triggered")
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
                        floatingLabelText="Email" />
                    </div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({name: evt.target.value}) }}
                        value={this.state.name}
                        floatingLabelText="Name" />
                    </div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({password: evt.target.value}) }}
                        type="password"
                        value={this.state.passowrd}
                        floatingLabelText="Password" />
                    </div>

                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({conf_password: evt.target.value}) }}
                        type="password"
                        value={this.state.conf_password}
                        floatingLabelText="Confirm Password" />
                    </div>
                    <br />
                    <div style={{textAlign: 'center'}}>
                      <RaisedButton label="SIGNUP" primary={true} onTouchTap={this.signup} />
                    </div>

                </div>


                </div>
            </div>
          </div>
        </MuiThemeProvider>
  );
}
};

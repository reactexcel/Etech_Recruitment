import React from 'react';
import { router } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import Logo from './../assets/images/logo.png';
import {Link} from 'react-router';


const styles = {
  errorStyle: {
    textAlign:'left',
  },
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
}

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
      snackbarmsg:'',
      loading:'hidden',
      signup:'show'
    }
    this.goBack = this.goBack.bind(this)
    this.signup = this.signup.bind(this)
  }
  componentWillMount(){
    let self = this
    Meteor.autorun(function(c) {
      self.autorun = c;
      if (Meteor.userId()) {
        self.props.router.push('/inbox')
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

    if(email != '' && emailValid == true && name != '' && password != '' && password == this.state.conf_password){
      this.setState({
        loading:'show',
        signup:'hidden'
      })
      this.props.onRegisterUser(email, name, password).then( () => {
        this.setState({
          email: '',
          name:'',
          password: '',
          conf_password : '',
          snackbarOpen:true,
          snackbarmsg:"You have registered successfully",
          loading:'hidden',
          signup:'show'
        })
      }).catch( (error) => {
        this.setState({
          loading:'hide',
          signup:'show',
          snackbarOpen:true,
          snackbarmsg:"Error : Username already exist"
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
            <div style={{textAlign: 'center' }}>
                <div style={{width: 340, margin: '0px auto',padding:'20px 0px'}}>
                  <div style={{marginBottom:'40px'}}>
                    <img src={Logo} style={{cursor:"pointer"}} />
                  </div>
                <div style={{width: 320,margin:'1rem', paddingTop: 20,backgroundColor: this.context.muiTheme.palette.canvasColor,padding:'30px',borderRadius:'5px'}}>
                    <div style={{fontSize:'16px',marginBottom:'1rem',textAlign:'left'}}>Sign up</div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        floatingLabelFixed={true}
                        onChange={ (evt) => {  this.setState({email: evt.target.value}) }}
                        value={this.state.email}
                        errorStyle={styles.errorStyle}
                        errorText={this.state.errorEmail}
                        floatingLabelText="Email" />
                    </div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({name: evt.target.value}) }}
                        value={this.state.name}
                        floatingLabelFixed={true}
                        errorStyle={styles.errorStyle}
                        errorText={this.state.errorName}
                        floatingLabelText="Name" />
                    </div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({password: evt.target.value}) }}
                        type="password"
                        floatingLabelFixed={true}
                        value={this.state.passowrd}
                        errorStyle={styles.errorStyle}
                        errorText={this.state.errorPass}
                        floatingLabelText="Password" />
                    </div>

                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        onChange={ (evt) => {  this.setState({conf_password: evt.target.value}) }}
                        type="password"
                        floatingLabelFixed={true}
                        errorStyle={styles.errorStyle}
                        value={this.state.conf_password}
                        errorText={this.state.errorCpass}
                        floatingLabelText="Confirm Password" />
                    </div>
                   
                    <br />
                    <div className={this.state.signup} style={{textAlign: 'center'}}>
                      <RaisedButton label="SIGNUP" primary={true} fullWidth={true} onTouchTap={this.signup} />
                    </div>
                     <div className={this.state.loading}>
                     <RefreshIndicator
                        size={40}
                        left={0}
                        top={0}
                        status="loading"
                        style={styles.refresh} />
                        </div>
                </div>
                  <div style={{color: this.context.muiTheme.palette.canvasColor}}>Already have an account?
                   <Link to="login" className="link" style={{color:"#00BCD4"}}>{" Sign in "}</Link></div>
                   
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

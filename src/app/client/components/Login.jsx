import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
import Snackbar from 'material-ui/Snackbar';

export default class Login extends React.Component{
	static contextTypes={
			muiTheme:React.PropTypes.object.isRequired
    }
	constructor(props){
		super(props);
		this.state={
			email:'',
			emailError:'',
			password:'',
			passwordError:'',
			showSnackbar:false,
			errorMessage:''
		}
		this.loginUser=this.loginUser.bind(this);
	}
	/*componentWillMount(){
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
  }*/
	loginUser(){
        let email=this.state.email.trim()
		let password=this.state.password.trim()
		if(email == ""){
           this.setState({
             emailError:"Please enter an e-mail address"
           })
        }else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)){
           this.setState({
             emailError:"You have entered an invalid e-mail address"
           })
        }else{
          this.setState({
             emailError:'',
          })
        }if(password == ""){
          this.setState({
             passwordError:"Please provide a valid password"
          })
        }else{
          this.setState({
             passwordError:""
          })
        }
        if(this.state.email != '' && this.state.password != ''){
           this.props.onLogin(this.state.email,this.state.password).then(()=>{
           	 this.setState({
			   email:'',
			   password:'',
			   errorMessage:'You have successfully login',
			   showSnackbar:true
		     })
           }).catch((error)=>{
           	this.setState({
           		
			   errorMessage:"User not found",
			   showSnackbar:true
		     })
           })
        }
	}
	handleRequestClose(){
        this.setState({
            showSnackbar: false
        })
    }
	render(){
		return(
			<div>
		     <AppBar 
		     title="Login"
		     />
		     <div style={{textAlign:'center'}}>
		     <div style={{width:400,paddingTop:5,margin:'0px auto'}}>
		     <h3>Login</h3>
               <div>
				<TextField errorText={this.state.emailError} value={this.state.email} style={{width:'80%'}} floatingLabelText="Email"
				onChange={
					(e)=>{
						this.setState({
							email:e.target.value
						})
					}
				}/>
				</div>
				<div>
				<TextField type="password" errorText={this.state.passwordError} value={this.state.password} style={{width:'80%'}} floatingLabelText="Password"
				onChange={
					(e)=>{
						this.setState({
							password:e.target.value
						})
					}
				}/>
				</div>
				<div style={{textAlign: 'left',marginLeft:40}}>
                 <Link to="forgotpassword" className="link">{"forgot password"}</Link>
                 <div>
                 <Link to="register" className="link" >{"Register"}</Link>
                 </div>
				</div>
				<div style={{textAlign: 'right'}}>

                      <RaisedButton label="LOGIN" onTouchTap={this.loginUser} primary={true}/>
                </div>
		     </div>
		     <Snackbar
                    open={this.state.showSnackbar}
                    message={this.state.errorMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose.bind(this)}
                />
		     </div>
		    </div>
			);
		
	}
}

Login.propTypes={
	onLogin:React.PropTypes.func.isRequired
}
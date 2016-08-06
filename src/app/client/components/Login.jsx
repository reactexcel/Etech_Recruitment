import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Checkbox from 'material-ui/Checkbox';


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
	componentWillMount(){
    let self = this
    Meteor.autorun(function(c) {
      self.autorun = c;
      if (Meteor.userId()) {
        //self.props.router.push('/user')
        //c.stop()
      }  
    });    
  }
  componentWillUnmount(){
    this.autorun.stop()
  }
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
			<div className="col-md-12" style={{textAlign:'center'}}>
			<div style={
                        {
                          fontFamily: this.context.muiTheme.fontFamily, 
                          color: this.context.muiTheme.palette.accent1Color,
                          textAlign: 'center',
                          fontSize:'20px'
                        }
                    }>Login</div>
		     <div style={{
		     	width:300,
		     	paddingTop:20,
		     	paddingBottom:20,
		     	paddingLeft:20,
		     	paddingRight:20,
		     	margin:'0px auto',
		     	marginTop:'20px',
		     	backgroundColor:'white',
		     	borderRadius:'3px'
		     }}>
		     
               <div>
				<TextField errorText={this.state.emailError} value={this.state.email} style={{width:'100%'}} floatingLabelText="Email"
				onChange={
					(e)=>{
						this.setState({
							email:e.target.value
						})
					}
				}/>
				</div>
				<div>
				<TextField type="password" errorText={this.state.passwordError} value={this.state.password} style={{width:'100%'}} floatingLabelText="Password"
				onChange={
					(e)=>{
						this.setState({
							password:e.target.value
						})
					}
				}/>
				</div>
				<div>
                 <Checkbox label="Keep me signed in" style={{textAlign:'left'}}/>
				</div>
				
				<div style={{marginTop:'10px'}}>

                      <RaisedButton style={{width:'100%',marginTop:'10px'}} label="LOGIN" onTouchTap={this.loginUser} primary={true}/>
                </div>
		     </div>
		     <div style={
                        {
                          fontFamily: this.context.muiTheme.fontFamily, 
                          color: '#40C4FF',
                          textAlign: 'center',
                          marginTop:'20px'

                        }
                    }>
                    <Link to="forgotpassword" className="link" style={{fontSize:'15px',textDecoration:'none'}}>{"Forgotpassword?"}</Link>
              </div>
              <div style={{
              	          fontFamily: this.context.muiTheme.fontFamily, 
                          color: '#40C4FF',
                          textAlign: 'center',
                          marginTop:'20px'
              }}>
              <div style={{color: this.context.muiTheme.palette.canvasColor,fontSize:'15px',display:'inline'}}>Do not have an account?</div>{" "}
              <Link to="register" className="link" style={{display:'inline',fontSize:'15px',textDecoration:'none'}}>{"Sign Up"}</Link>
              </div>
		     <Snackbar
                    open={this.state.showSnackbar}
                    message={this.state.errorMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose.bind(this)}
                />
		    </div>
			);
		
	}
}

Login.propTypes={
	onLogin:React.PropTypes.func.isRequired
}
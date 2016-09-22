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
import LogoImg from './../assets/images/logo.png';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
    textAlign:'left',
    fontWeight:'normal'
  },
  errorStyle:{
  	textAlign:'left',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
   container: {
    position: 'relative',
    marginTop:10
  }
};
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
			errorMessage:'',
			showButton:'show',
      rememberMe:false,
			showloader:'hide'
		}
		this.loginUser=this.loginUser.bind(this);
	}
	componentWillMount(){
      if (Meteor.userId()) {
       this.props.router.push('/inbox');
      }
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
        }else if(password == ""){
          this.setState({
          	 emailError:'',
             passwordError:"Please provide a valid password"
          })
        }else{
          this.setState({
          	 emailError:"",
             passwordError:"",
             showloader:'show',
             showButton:'hide'
          });

          this.props.onLogin(this.state.email,this.state.password,this.state.rememberMe).then(()=>{
           	 this.setState({
			   email:'',
			   password:'',
			   errorMessage:'You have successfully login',
			   showSnackbar:true,
			   showloader:'hide',
			   showButton:'show'
		     })
         this.props.router.push('/inbox');
           }).catch((error)=>{
           	this.setState({
			   errorMessage:"Invalid Email/Password",
			   showSnackbar:true,
			   showloader:'hide',
			   showButton:'show'
		     })
         this.props.router.push('/');
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
			<div style={{marginBottom:'40px'}}><img src={LogoImg}/></div>
		     <div style={{
		     	width:320,
		     	padding:30,
		     	margin:'0px auto',
		     	marginTop:'1rem',
		     	backgroundColor:'white',
		     	borderRadius:'3px'
		     }}>
		     <div style={
                        {
                          fontFamily: this.context.muiTheme.fontFamily,
                          textAlign: 'left',
                          fontSize:'17px'
                        }
                    }>Sign In</div>
               <div>
				<TextField floatingLabelFixed={true} errorStyle={styles.errorStyle} errorText={this.state.emailError} value={this.state.email} style={{width:'100%'}} floatingLabelText="Email"
				onChange={
					(e)=>{
						this.setState({
							email:e.target.value
						})
					}
				}/>
				</div>
				<div>
				<TextField floatingLabelFixed={true} errorStyle={styles.errorStyle} type="password" errorText={this.state.passwordError} value={this.state.password} style={{width:'100%'}} floatingLabelText="Password"
				onChange={
					(e)=>{
						this.setState({
							password:e.target.value
						})
					}
				}/>
				</div>
				<div>
                 <Checkbox labelStyle={styles.checkbox} label="Keep me signed in" style={styles.checkbox}
                 onCheck={(e, check)=>{
                      if(check==true){
                        this.setState({
                          rememberMe:true
                        })
                      }else{
                        this.setState({
                          rememberMe:false
                        })
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}/>
				</div>

				<div style={{marginTop:'10px'}} className={this.state.showButton}>

                      <RaisedButton style={{width:'100%',marginTop:'10px'}} label="LOGIN" onTouchTap={this.loginUser} primary={true}/>
                </div>
                <div style={styles.container} className={this.state.showloader}>
                <RefreshIndicator
                  size={40}
                  left={10}
                  top={0}
                  status="loading"
                  style={styles.refresh}
                 />
               </div>
		     </div>
		     <div style={
                        {
                          fontFamily: this.context.muiTheme.fontFamily,
                          textAlign: 'center',
                          marginTop:'20px'

                        }
                    }>
                    <Link to="forgotpassword" className="link" style={{fontSize:'15px',textDecoration:'none',color:'#00BCD4',cursor:'pointer'}}>{"Forgot Password?"}</Link>
              </div>
              <div style={{
              	          fontFamily: this.context.muiTheme.fontFamily,
                          color: '#00bcd4',
                          textAlign: 'center',
                          marginTop:'20px'
              }}>
              <div style={{color: this.context.muiTheme.palette.canvasColor,fontSize:'15px',display:'inline'}}>Do not have an account?</div>{" "}
              <Link to="register" className="link" style={{display:'inline',fontSize:'15px',textDecoration:'none',cursor:'pointer',color:'#00BCD4'}}>{"Sign Up"}</Link>
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

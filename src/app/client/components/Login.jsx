import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router';
const classNames = require('classnames');

export default class Login extends React.Component{
	static contextTypes={
			muiTheme:React.PropTypes.object.isRequired
    }
	constructor(props){
		super(props);
		this.state={
			email:'',
			password:''
		}
		this.loginUser=this.loginUser.bind(this);
	}
	loginUser(){
        this.props.onLogin(this.state.email,this.state.password).then(()=>{
            alert("Login successfull");
        }).catch((error)=>{
        	alert(error.toString());
        })
	}
	render(){
		return(
			<div>
		     <AppBar 
		     title="Login" 
		     iconElementRight={<RaisedButton label="LogIn" 
		     onTouchTap={this.openLogin}/>}
		     />
		     <div style={{textAlign:'center'}}>
		     <div style={{width:400,paddingTop:5,margin:'0px auto'}}>
		     <h3>Login</h3>
               <div>
				<TextField value={this.state.email} style={{width:'80%'}} floatingLabelText="Email"
				onChange={
					(e)=>{
						this.setState({
							email:e.target.value
						})
					}
				}/>
				</div>
				<div>
				<TextField value={this.state.password} style={{width:'80%'}} floatingLabelText="Password"
				onChange={
					(e)=>{
						this.setState({
							password:e.target.value
						})
					}
				}/>
				</div>
				<div style={{textAlign: 'left',marginLeft:40}}>
                 <Link to="forget" className="link">{"forgot password"}</Link>
                 <div>
                 <Link to="register" className="link" >{"Register"}</Link>
                 </div>
				</div>
				<div style={{textAlign: 'right'}}>

                      <RaisedButton label="LOGIN" onTouchTap={this.loginUser} primary={true}/>
                </div>
		     </div>
		     </div>
		    </div>
			);
		
	}
}

Login.propTypes={
	onLogin:React.PropTypes.func.isRequired
}
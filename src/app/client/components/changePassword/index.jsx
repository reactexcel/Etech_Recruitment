import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import {Menu, MenuItem} from 'material-ui/Menu'
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash'
import verge from 'verge';


const style = {
  container: {
    position: 'relative',
    textAlign:'center',
    paddingTop:'200px'
  },
  refresh: {
    verticalAlign:'middle',
    display: 'inline-block',
    position: 'relative',
  },
};

class ChangePassword extends React.Component {
    constructor( props ){
        super( props );
        this.state={
            errOldPass:'', 
            errNewPass:'', 
            errCNewPass:'',
            snackbarOpen:false,
            snackbarmsg:'',
            loader:'hidden',
        }
        this.changePassword = this.changePassword.bind( this )
        this.reset = this.reset.bind( this )
    }
    componentWillMount(){
    }
    reset(){
        this.refs.oldP.input.value = ''
        this.refs.newP.input.value = ''
        this.refs.cnewP.input.value = ''
    }
    changePassword(){
        let oldpass = this.refs.oldP.input.value.trim();
        let newpass = this.refs.newP.input.value.trim();
        let Cnewpass = this.refs.cnewP.input.value.trim();
        let flag = true
        if(oldpass == ''){
            this.setState({errOldPass:'Required'})
        }else{
            this.setState({errOldPass:''})
        }
        if(newpass == ''){
            this.setState({errNewPass:'Required'})
            flag = false
        }else if(newpass !== Cnewpass){
            this.setState({errCNewPass:'Password do not match'})
            flag = false
        }else{
            this.setState({
                errNewPass:'',
                errCNewPass:'',
            })
            flag = true
        }
        if(oldpass !== '' && flag){
            this.props.onChangePassword(oldpass,newpass).then((data)=>{
                this.reset()
                this.setState({
                    snackbarOpen:true,
                    snackbarmsg:data.toString(),
                })
            }).catch((error)=>{
                this.setState({
                    snackbarOpen:true,
                    snackbarmsg:error.toString(),
                })
            })
        }
    }
    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
    render(){
        return(
            <div className="row" style={{ "margin":"0px", "position" : "relative"}}>
                <div className="col-xs-2" style={{ "padding":"0px", "backgroundColor":"#fff", "height":verge.viewportH()+200+"px", "position":"absolute",}}>
                    <Menu desktop={true} style={{ hight:"100%", "float":"left"}}>
                        <MenuItem  primaryText="Change Password" onTouchTap={()=>{this.props.router.push("/changepassword")}}/>
                    </Menu>
                    <hr/>
                </div>
                <div className="col-xs-10" style={{ "float":"right"}}>
                    <div className='row' style={{margin:'40px 4px 0px'}}>
                    <div className="col-xs-12">
            <div className='row' style={{background: '#fff'}}>
                <div className="col-xs-12" style={{background: 'antiquewhite',padding: '10px',borderBottom: '1px solid gainsboro'}}>
                    <div className="col-xs-12">
                       <b><i>Change Password</i></b> <br /> 
                    </div>
                </div>
                <div className="col-xs-12" style={{fontSize: '20px',padding: "10px 20px 20px",borderBottom: '1px solid gainsboro'}}>
                    <TextField
                    type='password'
                    ref='oldP'
                    floatingLabelText="Old Password"
                    fullWidth={true}
                    errorText={this.state.errOldPass}
                    floatingLabelFixed={true}
                    />
                    <TextField
                    type='password'
                    ref='newP'
                    floatingLabelText="New Password"
                    fullWidth={true}
                    errorText={this.state.errNewPass}
                    floatingLabelFixed={true}
                    />
                    <TextField
                    type='password'
                    ref='cnewP'
                    floatingLabelText="Confirm New Password"
                    fullWidth={true}
                    errorText={this.state.errCNewPass}
                    floatingLabelFixed={true}
                    />
                    <br />  
                </div>
                  <RaisedButton
                    style={{float:'right',margin:'20px'}}
                    label='reset'
                    onClick={this.reset}
                    primary={true} 
                    ></RaisedButton>
                 <RaisedButton
                    style={{float:'right',margin:'20px'}}
                    label='Submit'
                    onClick={this.changePassword}
                    primary={true} 
                    ></RaisedButton>
            </div>
        </div>
        </div>
         <Snackbar
                      open={this.state.snackbarOpen}
                      message={this.state.snackbarmsg}
                      autoHideDuration={3000}
                      onRequestClose={this.handleRequestClose}
                  />
                </div>
            </div>
        
        );
    }
}

export default withRouter(ChangePassword)

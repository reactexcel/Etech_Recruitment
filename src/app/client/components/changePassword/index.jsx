import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';

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
class ChangePassword extends React.Component {
      static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired
  }
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
                    <MuiThemeProvider>
          <div>
            <div style={{textAlign: 'center' }}>
                <div style={{width: 340, margin: '0px auto',padding:'20px 0px'}}>
                
                <div style={{width: 320,margin:'1rem', paddingTop: 20,backgroundColor: this.context.muiTheme.palette.canvasColor,padding:'30px',borderRadius:'5px'}}>
                    <div style={{fontSize:'16px',marginBottom:'1rem',textAlign:'left'}}>Change Password</div>
                    <div>
                      <TextField
                    type='password'
                    ref='oldP'
                    floatingLabelText="Old Password"
                    fullWidth={true}
                    errorStyle={styles.errorStyle}
                    errorText={this.state.errOldPass}
                    floatingLabelFixed={true}
                    />
                    </div>
                    <div>
                      <TextField
                    type='password'
                    ref='newP'
                    floatingLabelText="New Password"
                    fullWidth={true}
                    errorStyle={styles.errorStyle}
                    errorText={this.state.errNewPass}
                    floatingLabelFixed={true}
                    />
                    </div>
                    <div>
                      <TextField
                    type='password'
                    ref='cnewP'
                    floatingLabelText="Confirm New Password"
                    fullWidth={true}
                    errorStyle={styles.errorStyle}
                    errorText={this.state.errCNewPass}
                    floatingLabelFixed={true}
                    />
                    </div>
                   
                    <br />
                    <div style={{textAlign: 'center'}}>
                    <RaisedButton
                    style={{margin:'20px'}}
                    label='Submit'
                    onClick={this.changePassword}
                    primary={true} 
                    ></RaisedButton>
                      <RaisedButton
                    style={{margin:'20px'}}
                    label='reset'
                    onClick={this.reset}
                    primary={true} 
                    ></RaisedButton>
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
          </div>
        </MuiThemeProvider>
        );
    }
}

export default withRouter(ChangePassword)

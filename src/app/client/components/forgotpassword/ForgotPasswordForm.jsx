import React, {PropTypes} from 'react'

import { router } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import Logo from '../../assets/images/logo.png';
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


class ForgotPasswordForm extends React.Component {
    static contextTypes = {
        muiTheme: React.PropTypes.object.isRequired
    }
    constructor( props ){
        super( props );
        this.state = {
            emailid : '',
            status_message : '',
            errorEmail:'',
            showSnackbar : false,
            loading:'hidden',
            submit:'show'
        }
        this.submitEmail = this.submitEmail.bind( this )
    }
    componentDidMount(){
    }
    submitEmail( evt ){
        evt.preventDefault();
        let emailid = this.state.emailid.trim()
        let emailValid = true
    if(emailid.length <= 0){
      this.setState({
        errorEmail:"Email required"
      })
    }else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(emailid)){
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
        if(emailid.length > 0 && emailValid == true){
            this.setState({
                loading:'show',
                submit:'hidden'
            })
            this.props.doForgotPassword( emailid ).then( (data) => {
                if(data == 0){
                this.setState({
                    emailid:'',
                    status_message:'Check your email for new password',
                    showSnackbar:true,
                    loading:'hidden',
                    submit:'show',
                })
                }else{
                this.setState({
                    status_message:data,
                    showSnackbar:true,
                    loading:'hidden',
                    submit:'show',
                })
                }
            }).catch( (error) => {
                this.setState({
                    status_message:error.toString(),
                    showSnackbar:true,
                    loading:'hidden',
                    submit:'show',
                })
            })
        }
    }
    handleRequestClose = () => {
        this.setState({
            showSnackbar: false,
        });
    };
    render(){
        return(
        <MuiThemeProvider>
          <div>
            <div style={{textAlign: 'center' }}>
                <div style={{width: 340, margin: '0px auto',padding:'20px 0px'}}>
                  <div style={{marginBottom:'40px'}}>
                    <img src={Logo} style={{cursor:"pointer"}} />
                  </div>
                <div style={{width: 320,margin:'1rem', paddingTop: 20,backgroundColor: this.context.muiTheme.palette.canvasColor,padding:'30px',borderRadius:'5px'}}>
                    <div style={{fontSize:'16px',marginBottom:'1rem',textAlign:'left'}}>Forgot Password</div>
                    <div>
                      <TextField 
                        style={{width: '100%'}}
                        floatingLabelFixed={true}
                        onChange={ (evt) => {  this.setState({emailid: evt.target.value}) }}
                        value={this.state.emailid}
                        errorStyle={styles.errorStyle}
                        errorText={this.state.errorEmail}
                        floatingLabelText="Email" />
                    </div>
                    <br />
                    <div className={this.state.submit} style={{textAlign: 'center'}}>
                      <RaisedButton label="Submit" primary={true} fullWidth={true} onTouchTap={this.submitEmail} />
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
                  <div style={{color: this.context.muiTheme.palette.canvasColor}}>To go to login page
                   <Link to="login" className="link" style={{color:"#00BCD4"}}>{" Click here "}</Link>
                   </div>
                  <Snackbar
                      open={this.state.showSnackbar}
                      message={this.state.status_message}
                      autoHideDuration={15000}
                      onRequestClose={this.handleRequestClose}
                  />
                </div>
            </div>
          </div>
        </MuiThemeProvider>
        )
    }
}

ForgotPasswordForm.propTypes = {
   doForgotPassword: PropTypes.func.isRequired
};

export default ForgotPasswordForm


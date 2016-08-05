import React, {PropTypes} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar';

class ForgotPasswordForm extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            emailid : '',
            status_message : '',
            showSnackbar : false
        }
        this.submitForm = this.submitForm.bind( this )
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
        if( props.status_message != '' ){
            this.setState({
                status_message : props.status_message,
                showSnackbar : true
            })
        }
    }
    submitForm( evt ){
        evt.preventDefault();
        if(this.state.emailid.length > 0){
            this.props.doForgotPassword( this.state.emailid )
        }else{
            this.setState({
                status_message : "Enter email id",
                showSnackbar : true
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
            <div>
            	<form onSubmit={this.submitForm} className="todoForm">
                  <div>
                    <TextField
                        hintText="Enter your email id"
                        fullWidth={true}
                        onChange={ (e) => {  
                            this.setState({
                                emailid: e.target.value
                            })
                        } }
                        value={this.state.emailid}
                        type="text"
                    />
                    <br/>
                    <br/>
                    <RaisedButton type="submit" label="Reset Password" fullWidth={true} />
                  </div>
                </form>
                <Snackbar
                    open={this.state.showSnackbar}
                    message={this.state.status_message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        )
    }
}

ForgotPasswordForm.propTypes = {
   doForgotPassword: PropTypes.func.isRequired
};

export default ForgotPasswordForm


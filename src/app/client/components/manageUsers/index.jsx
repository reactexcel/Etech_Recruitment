import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import _ from 'lodash'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import Delete from 'material-ui/svg-icons/action/delete';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle'
import Avatar from 'material-ui/Avatar'
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import SelectField from 'material-ui/SelectField';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}from 'material-ui/Table';
const classNames = require('classnames');

const styles = {
  block: {
    maxWidth: 250,
  },
  lable:{
    fontWeight:'normal',
    fontSize:15
  },
  container: {
    position: 'relative',
    textAlign:'center',
    paddingTop:'200px'
  },
  formInput:{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "60%"
  },
};
class Variables extends React.Component {
  constructor( props ){
        super( props );
        this.state={
          userId:'',
          paper:'show',
          list:'row',
          openDialog:false,
          dialogTitle:'',
          username:'',
          nameError:'',
          emailValue:'',
          password:'',
          conf_password:'',
          emailError:'',
          errorPass:'',
          errorCpass:'',
          snackbarOpen:false,
          snackbarmsg:'',
          loader:'hidden',
          userType:'',
          userTypeError:'',
          openAlert:false,
          user:''
        }
        this.openCreateUser = this.openCreateUser.bind(this)
        this.saveUser = this.saveUser.bind(this)
        //this.deleteUser = this.deleteUser.bind(this);
        
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        this.setState({
          loader:'show',
          paper:'hidden'
        })
        this.props.onFetchUsers().then( (data) => {
        this.setState({
          snackbarOpen:false,
          snackbarmsg:data.toString(),
          loader:'hidden',
          paper:'show'
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          loader:'hidden',
          paper:'show'
        })
      })
        
    }
    changeUserType = (event,index,value) =>{
      this.setState({
        userType:value
      })
    }
    
    openCreateUser(){
      
        this.setState({
            username:'',
            nameError:'',
            emailValue:'',
            password:'',
            conf_password:'',
            emailError:'',
            errorPass:'',
            errorCpass:'',
            userTypeError:'',
            openDialog:true,
            dialogTitle:"Add User",
        })
    }
    handleClose(){
      this.setState({titlepop: false});
    }
    gotoUserPage(){
        this.setState({
            username:'',
            nameError:'',
            emailValue:'',
            password:'',
            conf_password:'',
            emailError:'',
            errorPass:'',
            errorCpass:'',
            userTypeError:'',
            openDialog:false,
            dialogTitle:'',
        })
    }
    saveUser() {
      let username = this.state.username.replace(/^\s+|\s+$/gm,'')
      let email = this.state.emailValue.replace(/^\s+|\s+$/gm,'')
      let password = this.state.password.replace(/^\s+|\s+$/gm,'')
      let userType = this.state.userType
      let emailValid = true
      let id = this.state.userId
      let pass = false
      let con_pass = false
      if(username == ""){
        this.setState({
          nameError:"Name Required"
        })
      }else{
        this.setState({
          nameError:""
        })
      }
      if(email == ""){
         this.setState({
            emailError:"Email required"
         })
         emailValid = false
      }else if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)){
          this.setState({
             emailError:"Enter a valid email"
          })
           emailValid = false
      }else{
          this.setState({
             emailError:''
          })
          emailValid = true
      }
      if(userType==''){
            this.setState({
              userTypeError:'Select tytpe of user'
            })
        }else{
            this.setState({userTypeError:''})
        }
        if(this.state.userId == ""){
          if(password == ""){
              this.setState({
                 errorPass:"Password required"
              })
          }else{
              this.setState({
                 errorPass:""
              })
              pass =true
          }
          if(password !== this.state.conf_password){
             this.setState({
                errorCpass:"Password do not match"
             })
          }else{
            this.setState({
               errorCpass:""
            })
            con_pass = true
          }
        }else{
          pass = true
          con_pass = true
        }
      
      if(email != '' && emailValid == true && username != '' && userType != '' && pass == true && con_pass == true){
        let userDetail= {
          username:username,
          email:email,
          userType:userType,
          password:password,
        }
        this.props.onSaveUser(id,userDetail).then(()=>{
          this.setState({
            username:'',
            emailValue:'',
            password:'',
            conf_password:'',
            userType:'',
            snackbarOpen:true,
            snackbarmsg:"User saved successfully",
            userId:'',
            openDialog:false
        })
        if(id==""){
            this.props.logging("New user added",Meteor.userId(),"User name : "+username)
        }else{
            this.props.logging("User detail edited",Meteor.userId(),"User name : "+username)
        }
        this.gotoUserPage()
        }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          //snackbarmsg:"Error : Username already exist",
          username:'',
          emailValue:'',
          password:'',
          conf_password:'',
          userType:'',
        })
      })
      }
    }

    editUser(data){
        this.setState({
            username:data.username,
            nameError:'',
            emailValue:data.emails[0].address,
            password:'',
            conf_password:'',
            emailError:'',
            errorPass:'',
            errorCpass:'',
            userType:data.roles[0],
            userTypeError:'',
            openDialog:true,
            userId:data._id,
            dialogTitle:"Edit User",
        })
    }
    deleteUser(){
      let user = this.state.user
    this.props.onDeleteUser(user._id).then( () => {
        this.setState({
          openAlert:false,
          snackbarOpen:true,
          snackbarmsg:"User Deleted successfully",
        })
        this.props.logging("User deleted",Meteor.userId(),"User name : "+user.username)
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }
    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
    closeAlert = () => {
      this.setState({
            openAlert:false
          })
    }
    render(){
      const actions = [
      <FlatButton
              label="BACK"
              primary={true}
              onTouchTap={this.gotoUserPage.bind(this)}
              style={{marginRight:5}}
            />,
            <RaisedButton
              label="SAVE"
              primary={true}
              onClick={this.saveUser}
            />,
    ];
    const deleteActions = [
      <FlatButton
              label="Cancle"
              primary={true}
              onTouchTap={this.closeAlert}
              style={{marginRight:5}}
            />,
            <FlatButton
              label="Ok"
              primary={true}
              onClick={this.deleteUser.bind(this)}
            />,
    ];
      
      
      return(
        <div className="col-xs-12 col-sm-12" style={{ "float":"right"}}>
            
            <Dialog
              title={this.state.dialogTitle}
              actions={actions}
              modal={false}
              open={this.state.openDialog}
              onRequestClose={this.gotoUserPage.bind(this)}
              autoScrollBodyContent={true}
            >
            <div>
              <form className="form-inline">
              <div className="form-group" style={styles.formInput}>
              <TextField
                    ref='Name'
                    floatingLabelText="User name"
                    floatingLabelFixed={true}
                    hintText="Enter user name"
                    fullWidth={true}
                    errorText={this.state.nameError}
                    value={this.state.username}
                    onChange={(e)=>{
                      this.setState({
                          username: e.target.value,
                      });
                    }}
              />
              </div>
              <div className="form-group" style={styles.formInput}>
              <TextField
                    ref='Email'
                    floatingLabelText="Email"
                    floatingLabelFixed={true}
                    hintText="Enter email address"
                    fullWidth={true}
                    errorText={this.state.emailError}
                    value={this.state.emailValue}
                    onChange={(e)=>{
                      this.setState({
                          emailValue: e.target.value,
                      });
                    }}
              />
              </div>
              <div className="form-group" style={styles.formInput}>
              <SelectField
                    value={this.state.userType}
                    onChange={this.changeUserType}
                    floatingLabelText="User Type"
                    floatingLabelFixed={true}
                    hintText="Select User Type"
                    errorText={this.state.userTypeError}
              >
                    <MenuItem value="" key={0} primaryText="           "/>
                    <MenuItem value="Admin" key={1} primaryText="Admin" />
                    <MenuItem value="User" key={2} primaryText="User" />
              </SelectField>
              </div>
              <div className="form-group" style={styles.formInput}>
              <TextField 
                        fullWidth={true}
                        onChange={ (evt) => {  
                          this.setState({password: evt.target.value}) 
                        }}
                        type="password"
                        floatingLabelFixed={true}
                        value={this.state.passowrd}
                        errorText={this.state.errorPass}
                        floatingLabelText="Password" 
                        hintText="Enter password"
              />
              </div>
              <div className="form-group" style={styles.formInput}>
                      <TextField 
                        fullWidth={true}
                        onChange={ (evt) => {  
                          this.setState({conf_password: evt.target.value}) 
                        }}
                        type="password"
                        floatingLabelFixed={true}
                        value={this.state.conf_password}
                        errorText={this.state.errorCpass}
                        floatingLabelText="Confirm Password"/>
                    </div>
              </form>
            </div>
            </Dialog>
            <Dialog
             actions={deleteActions}
             modal={false}
             open={this.state.openAlert}
             onRequestClose={this.closeAlert}
            >
             Are You sure to delete ?
            </Dialog>
        <div className={this.state.list} style={{margin:'0px 4px 0px'}}>
                    <div className="col-xs-12">
                      <div className='row'>
                        <div className='col-xs-12' style={{paddingTop:'10px',paddingRight:'0px'}}>
                          <RaisedButton
                            style={{float:'right',margin:'0px'}}
                            label='Add New User'
                            onClick={this.openCreateUser}
                            primary={true}
                            ></RaisedButton>
                        </div>
                        <div className={this.state.loader} style={styles.container}>
                          <CircularProgress size={1.5} />
                        </div>
                        <div className={this.state.paper} style={{"marginTop":"8%"}}>
                        <Paper  zDepth={2}>
                        <Table
                         fixedHeader={true}
                         fixedFooter={true}
                         onRowSelection={
                            (rowNumber) => {
                              if(rowNumber.length == 1){
                                this.editUser(this.props.userList[rowNumber])
                              }
                            }
                         }
                        >
                        <TableHeader
                         adjustForCheckbox={false}
                         displaySelectAll={false}
                        >
                        <TableRow>
                        <TableRowColumn colSpan="4" >
                           <h4 style={{float: 'left', "marginLeft":"-5%","paddingTop":"1%","paddingBottom":"1%","paddingLeft":"5%","paddingRight":"3%","fontWeight": "bold"}}>User(s)</h4>
                        </TableRowColumn>
                        </TableRow>
                        <TableRow>
                         <TableRowColumn colSpan={1} tooltip="User name" style={{"fontWeight": "bold"}}>User name</TableRowColumn>
                         <TableRowColumn colSpan={1} tooltip="Email" style={{"fontWeight": "bold"}}>Email</TableRowColumn>
                         <TableRowColumn colSpan={1} tooltip="User type" style={{"fontWeight": "bold"}}>User type</TableRowColumn>
                         <TableRowColumn colSpan={1} tooltip="Delete" style={{"fontWeight": "bold",textAlign:'center'}}>Delete</TableRowColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody
                         displayRowCheckbox={false}
                        >
                        {(this.props.userList.length>0)?(
                          _.map(this.props.userList, (user) => (
                          (typeof user.roles !== 'undefined')?
                          <TableRow key={user._id}
                            onChange={ (evt) => {
                            }}
                            style={{'cursor':'pointer'}}
                          >
                          <TableRowColumn colSpan={1} >{user.username}</TableRowColumn>
                          <TableRowColumn colSpan={1} >{user.emails[0].address}</TableRowColumn>
                          <TableRowColumn colSpan={1} >{user.roles[0]}</TableRowColumn>
                          <TableRowColumn colSpan={1} style={{textAlign:'center'}}>
                          <IconButton
                          tooltip="Delete User"
                          tooltipPosition="right"
                          iconStyle={{"color":"#B71C1C"}}
                          children={
                            <Delete color='#B71C1C'/>
                          }
                        onClick= {
                         (evt) => {
                           evt.stopPropagation();
                           this.setState({
                            user:user,
                            openAlert:true
                           })
                           
                         }
                       }
                       />
                          </TableRowColumn>
                          </TableRow>:""
                          ))):(<TableRow ><TableRowColumn colSpan={4} style={{textAlign:'center'}}>{"No User found"}</TableRowColumn></TableRow>)}
                        </TableBody>
                        </Table>
                        </Paper>
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
        )
    }
}
export default withRouter(Variables)
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
          paper:'show',
          list:'row',
          openDialog:false,
          dialogTitle:'',
          variableCode:'',
          varCodeError:'',
          variableValue:'',
          varValError:'',
          snackbarOpen:false,
          snackbarmsg:'',
          floatingLabelCode:'Variable Code',
          hintCode:'Enter Variable Code',
          floatingLabelValue:'Variable Value',
          hintCode:'Enter Variable Value',
          loader:'hidden'
        }
        this.openCreateVariable = this.openCreateVariable.bind(this)
        this.saveVariable = this.saveVariable.bind(this)
        this.deleteVariable = this.deleteVariable.bind(this);
        
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        this.setState({
          loader:'show',
          paper:'hidden'
        })
        this.props.onFetchVariables().then( (data) => {
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
    deleteVariable(vari){
    this.props.onDeleteVariable(vari._id).then( () => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:"Variable Deleted successfully",
        })
        this.props.logging("Variable deleted",Meteor.userId(),"Variable name : "+vari.varCode)
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }
    openCreateVariable(){
      
        this.setState({
            variableCode:'',
            varCodeError:'',
            variableValue:'',
            varValError:'',
            openDialog:true,
            varId:'',
            dialogTitle:"Create Variable",
            floatingLabelCode:'Variable Code',
            hintCode:'Enter Variable Code',
            floatingLabelValue:'Variable Value',
            hintCode:'Enter Variable Value',
        })
    }
    handleClose(){
      this.setState({titlepop: false});
    }
    gotoVariablePage(){
        this.setState({
            variableCode:'',
            varCodeError:'',
            variableValue:'',
            varValError:'',
            openDialog:false,
            dialogTitle:'',
        })
    }
    saveVariable() {
      let varCode = this.state.variableCode.replace(/^\s+|\s+$/gm,'')
      let varVal = this.state.variableValue.replace(/^\s+|\s+$/gm,'')
      let id = this.state.varId
      if(varCode!=''){
        this.setState({varCodeError:''})
      }else{
        this.setState({varCodeError:'Required'})
      }
      if(varVal!=''){
        this.setState({varValError:''})
      }else{
        this.setState({varValError:'Required'})
      }
      if(varCode!='' && varVal!=''){
        varCode = varCode.toLowerCase()
        if(_.trim(varCode)[0]=="#"){

        }else{
           varCode = "#"+varCode
        }
        let variable={
              varCode:varCode,
              varValue:varVal
            }
        this.props.onSaveVariable(id,variable).then( () => {
          this.setState({
            variableCode:'',
            variableValue:'',
            snackbarOpen:true,
            snackbarmsg:"Variable saved successfully",
            varId:''
          })
        if(id==""){
            this.props.logging("New variable added",Meteor.userId(),"Variable name : "+varCode)
        }else{
            this.props.logging("Variable edited",Meteor.userId(),"Variable name : "+varCode)
        }
        this.gotoVariablePage()
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          variableCode:'',
          variableValue:'',
        })
      })
      }
    }

    editVariable(data){
        this.setState({
            variableCode:data.varCode,
            varCodeError:'',
            variableValue:data.varValue,
            varValError:'',
            openDialog:true,
            varId:data._id,
            dialogTitle:"Edit Variable",
            floatingLabelCode:'Variable Code',
            hintCode:'',
            floatingLabelValue:'Variable Value',
            hintCode:'',
        })
    }
    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
    render(){
      const actions = [
      <FlatButton
              label="BACK"
              primary={true}
              onTouchTap={this.gotoVariablePage.bind(this)}
              style={{marginRight:5}}
            />,
            <RaisedButton
              label="SAVE"
              primary={true}
              onClick={this.saveVariable}
            />,
    ];
      
      
      return(
        <div className="col-xs-12 col-sm-12" style={{ "float":"right"}}>
            
            <Dialog
              title={this.state.dialogTitle}
              actions={actions}
              modal={false}
              open={this.state.openDialog}
              onRequestClose={this.gotoVariablePage.bind(this)}
              autoScrollBodyContent={true}
            >
            <div>
              <form className="form-inline">
              <div className="form-group" style={styles.formInput}>
              <TextField
                    ref='value'
                    floatingLabelText={this.state.floatingLabelCode}
                    floatingLabelFixed={true}
                    hintText={this.state.hintCode}
                    fullWidth={true}
                    errorText={this.state.varCodeError}
                    value={this.state.variableCode}
                    onChange={(e)=>{
                      this.setState({
                          variableCode: e.target.value,
                      });
                    }}
              />
              </div>
              <div className="form-group" style={styles.formInput}>
              <TextField
                    ref='Name'
                    floatingLabelText={this.state.floatingLabelValue}
                    floatingLabelFixed={true}
                    hintText={this.state.hintValue}
                    fullWidth={true}
                    errorText={this.state.varValError}
                    value={this.state.variableValue}
                    onChange={(e)=>{
                      this.setState({
                          variableValue: e.target.value,
                      });
                    }}
              />
              </div>
              </form>
            </div>
            </Dialog>

        <div className={this.state.list} style={{margin:'0px 4px 0px'}}>
                    <div className="col-xs-12">
                      <div className='row'>
                        <div className='col-xs-12' style={{paddingTop:'10px',paddingRight:'0px'}}>
                          <RaisedButton
                            style={{float:'right',margin:'0px'}}
                            label='Add New Variable'
                            onClick={this.openCreateVariable}
                            primary={true}
                            ></RaisedButton>
                        </div>
                        <div className={this.state.loader} style={styles.container}>
                          <CircularProgress size={1.5} />
                        </div>
                        <div className={this.state.paper} style={{"marginTop":"8%"}}>
                        <Paper  zDepth={2} >
                        <Table
                         fixedHeader={true}
                         fixedFooter={true}
                         onRowSelection={
                            (rowNumber) => {
                              if(rowNumber.length == 1){
                                this.editVariable(this.props.variables[rowNumber])
                              }
                            }
                         }
                        >
                        <TableHeader
                         adjustForCheckbox={false}
                         displaySelectAll={false}
                        >
                        <TableRow>
                        <TableRowColumn colSpan="3" >
                           <h4 style={{float: 'left', "marginLeft":"-5%","paddingTop":"1%","paddingBottom":"1%","paddingLeft":"5%","paddingRight":"3%","fontWeight": "bold"}}>Variable(s)</h4>
                        </TableRowColumn>
                        </TableRow>
                        <TableRow>
                         <TableRowColumn colSpan={1} tooltip="Variable code" style={{"fontWeight": "bold"}}>Variable code</TableRowColumn>
                         <TableRowColumn colSpan={1} tooltip="Variable value" style={{"fontWeight": "bold"}}>Variable value</TableRowColumn>
                         <TableRowColumn colSpan={1} tooltip="Delete" style={{"fontWeight": "bold",textAlign:'center'}}>Delete</TableRowColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody
                         displayRowCheckbox={false}
                        >
                        {_.map(this.props.variables, (vari) => (
                          <TableRow key={vari._id}
                            onChange={ (evt) => {
                            }}
                            style={{'cursor':'pointer'}}
                          >
                          <TableRowColumn colSpan={1} >{vari.varCode}</TableRowColumn>
                          <TableRowColumn colSpan={1} >{vari.varValue}</TableRowColumn>
                          <TableRowColumn colSpan={1} style={{textAlign:'center'}}>
                          <IconButton
                          tooltip="Delete Variable"
                          tooltipPosition="right"
                          iconStyle={{"color":"#B71C1C"}}
                          children={
                            <Delete color='#B71C1C'/>
                          }
                        onClick= {
                         (evt) => {
                           evt.stopPropagation();
                           this.deleteVariable(vari)
                         }
                       }
                       />
                          </TableRowColumn>
                          </TableRow>
                          ))}
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
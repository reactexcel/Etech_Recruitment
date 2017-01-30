import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import _ from 'lodash'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
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
import RichTextEditor from 'react-rte';
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
    "width": "90%",
    "paddingTop":'10px',
    "color": 'gray',
  },
  radioButton: {
    marginBottom: 16,
    width:"50%",
    float: 'left',
    marginBottom: '0px',
    marginTop: '16px',
  },
  radioLabel: {
    fontWeight: 300,
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
          variableType:'user',
          variableCode:'',
          varCodeError:'',
          variableValue: RichTextEditor.createEmptyValue(),
          variableValue_forTextArea:'',
          varValError:'',
          snackbarOpen:false,
          snackbarmsg:'',
          floatingLabelCode:'Variable Code',
          hintCode:'Enter Variable Code',
          floatingLabelValue:'Variable Value',
          hintCode:'Enter Variable Value',
          loader:'hidden',
          editor:'show',
          textArea:'hidden'
        }
        this.openCreateVariable = this.openCreateVariable.bind(this)
        this.saveVariable = this.saveVariable.bind(this)
        this.deleteVariable = this.deleteVariable.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changeEditor = this.changeEditor.bind(this)
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
    onChange (value){
      this.setState({variableValue: value});
    }
    changeEditor(e){
      if(e.target.value == 'textArea'){
        this.setState({
          textArea:'show',
          editor:'hidden'
        })
      }else{
        this.setState({
          textArea:'hidden',
          editor:'show'
        })
      }
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
            variableValue: RichTextEditor.createEmptyValue(),
            variableValue_forTextArea: '',
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
      let varCode = this.state.variableCode.replace(/^\s+|\s+$/gm,'').trim();
      let varVal = '';
      if(this.state.editor == 'show'){
        varVal = this.state.variableValue.toString('html'); //replace(/^\s+|\s+$/gm,'');
      }else{
        varVal = this.state.variableValue_forTextArea;
      }
      let varType = this.state.variableType.trim();
      let id = this.state.varId
      let state = true;
      var span= document.createElement('span');
      span.innerHTML= varCode;
      let codeText = span.textContent || span.innerText;
      codeText = codeText.trim();
      if(varCode!=''){
        this.setState({varCodeError:''})
      }else{
        this.setState({varCodeError:'Required'})
      }
      if(varType === 'user'){
        if(varVal!=''){
          this.setState({varValError:''})
        }else{
          state = false;
          this.setState({varValError:'Required'})
        }
      }else{
        varVal = ''
      }

      //-------------this is hardcode to change logo & system variables -----------
      // let  varCode = "#logo",
      //  varVal = '<img src="Excelogo-black.jpg" height="30" width="160">',
      //  varType = "system",
      //  id = "39";
      //-------------create new system variables -----------
      //  let  varCode = "#salary",
      //  varVal = '',
      //  varType = "system",
      //  id = '';

      if( state){
        varCode = varCode.toLowerCase();
        if(_.trim(varCode)[0]!=="#"){
          varCode = '#'+varCode;
        }
        let variable={
              varCode:varCode,
              varValue:varVal,
              varType:varType
            }
        this.props.onSaveVariable(id,variable).then( (data) => {
          this.setState({
            variableCode: '',
            variableValue: RichTextEditor.createEmptyValue(),
            variableValue_forTextArea:'',
            varId:''
          })
        this.gotoVariablePage()
      }).catch( (error) => {
        this.setState({
            variableCode: '',
            variableValue:RichTextEditor.createEmptyValue(),
            variableValue_forTextArea:''
          })
      })
      }
    }

    editVariable(data){
        this.setState({
            variableCode:data.varCode,
            varCodeError:'',
            variableValue:RichTextEditor.createValueFromString(data.varValue, 'html'),
            variableValue_forTextArea:data.varValue,
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
              label="Submit"
              primary={true}
              onClick={this.saveVariable}
            />,
    ];
      let userVar = _.filter(this.props.variables, function(o){return o.variable_type == 'user'});
      let systemVar = _.filter(this.props.variables, function(o){return o.variable_type === 'system'});
      
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
              <RadioButtonGroup name="shipSpeed" defaultSelected="richEditor" onChange={(e)=>{this.changeEditor(e)}}>
              <RadioButton
                value="textArea"
                label="Add header/footer"
                style={styles.radioButton}
              />
              <RadioButton
                value="richEditor"
                label="Other than header/footer"
                style={styles.radioButton}
              />
              </RadioButtonGroup>
              </div>
              <div className="form-group" style={styles.formInput}>
                <label style={{fontSize:'13px',color:'#BFBFBF'}}>Enter Variable Value</label>
                <div className={this.state.editor}>
                  <RichTextEditor
                    style={styles.editorStyle}
                    value={this.state.variableValue}
                    onChange={this.onChange}
                  />
                </div>
                <div className={this.state.textArea}>
                  <textarea 
                    style={{'width':'100%'}}
                    placeholder="Write html code for header/footer"
                    className="form-control" 
                    rows="4" 
                    ref="client_address" 
                    onChange={(e)=>{
                      this.setState({
                        variableValue_forTextArea: e.target.value,
                      });
                    }} 
                    value={this.state.variableValue_forTextArea}
                  />
                </div>
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
                        <Paper  zDepth={2} style={{marginBottom:'10px'}}>
                        <Table
                         fixedHeader={true}
                         fixedFooter={true}
                         onRowSelection={
                            (rowNumber) => {
                              if(rowNumber.length == 1){
                                this.editVariable(userVar[rowNumber])
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
                           <h4 style={{float: 'left', "marginLeft":"-5%","paddingTop":"1%","paddingBottom":"1%","paddingLeft":"5%","paddingRight":"3%","fontWeight": "bold"}}>User Variable(s)</h4>
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
                        {_.map(userVar, (vari,i) => (
                          <TableRow key={vari._id}
                            onChange={ (evt) => {
                            }}
                            style={{'cursor':'pointer'}}
                          >
                          <TableRowColumn colSpan={1} >{vari.varCode}</TableRowColumn>
                          <TableRowColumn colSpan={1} ><div className="p-l" dangerouslySetInnerHTML={{__html:vari.varValue}}></div></TableRowColumn>
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
                        <Paper  zDepth={1} style={{marginBottom:'10px'}}>
                        <Table
                         fixedHeader={true}
                         fixedFooter={true}
                        >
                        <TableHeader
                         adjustForCheckbox={false}
                         displaySelectAll={false}
                        >
                        <TableRow>
                        <TableRowColumn>
                           <h4 style={{float: 'left', "marginLeft":"-5%","paddingTop":"1%","paddingBottom":"1%","paddingLeft":"5%","paddingRight":"3%","fontWeight": "bold"}}>System Variable(s)</h4>
                        </TableRowColumn>
                        </TableRow>
                        <TableRow>
                         <TableRowColumn colSpan={1} style={{"fontWeight": "bold"}}>Variable code</TableRowColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody
                         displayRowCheckbox={false}
                        >
                        {_.map(systemVar, (vari) => (
                          <TableRow key={vari._id} style={{'cursor':'pointer'}} >
                          <TableRowColumn colSpan={1} >{vari.varCode}</TableRowColumn>
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
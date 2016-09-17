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
import CircularProgress from 'material-ui/CircularProgress';
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
          loader:'hidden',
        }
        this.openCreateVariable = this.openCreateVariable.bind(this)
        this.saveVariable = this.saveVariable.bind(this)
        
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        
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
      let varCode = this.state.variableCode.trim()
      let varVal = this.state.variableValue.trim()
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
        varCode = "#"+varCode
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
        /*let name=this.state.actionName.trim()
        let tagId=this.state.tagValue
        let templateId=this.state.tempValue
        let id = this.state.actionId
        let progress = this.state.progressToggle
        let report = this.state.showReportToggle
        let dependentAction = this.state.dependentAction
        let pPointClear = false;
        if(name!=''){
            this.setState({errName:''})
        }else{
            this.setState({errName:'Required'})
        }
        if(tagId==''){
            this.setState({tagError:'Select a tag'})
        }else{
            this.setState({tagError:''})
        }
        if(templateId==''){
            this.setState({tempError:'Select a template'})
        }else{
            this.setState({tagError:''})
        }if(progress==true){
          if(this.state.pPointValue==''){
            this.setState({pPointError:'Required'})
          }else if(!this.regExp.pPoint.test(this.state.pPointValue)){
            this.setState({pPointError:'Invalid value'})
          }else{
            progress=parseInt(this.state.pPointValue);
            this.setState({pPointError:''})
            pPointClear=true;
          }
        }else{
          progress=0;
          pPointClear=true;
        }
        if(name!='' && tagId!='' && templateId!='' && pPointClear==true){
            let action={
              name:name,
              dependentAction:dependentAction, 
              tagId:tagId, 
              templateId:templateId, 
              progress:progress,
              report:report
            }
            this.props.onSaveAction(id,action).then( () => {
        this.setState({
            actionName:'',
            snackbarOpen:true,
            snackbarmsg:"Action saved successfully",
            actionId:'',
            tmppage:'row',
            tmpcreat:'hidden'
        })
        
        this.gotoActionPage()
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          actionId:'',
          tmppage:'row',
          tmpcreat:'hidden'
        })
      })
      }*/
    /*deleteAction(id){
    this.props.onDeleteAction(id).then( () => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:"Action Deleted successfully",
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }*/
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
      /*let tagItems=[];
      tagItems.push(<MenuItem value="" key={0} primaryText="           "/>);
      if(this.props.tags.length > 0){
        _.map(this.props.tags,(tag, key)=>{
        if(tag.automatic==false){
            tagItems.push(<MenuItem value={tag._id} key={key+1} primaryText={tag.name} />)
          }
          })
      }*/
      
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
                        <Paper  zDepth={2} style={{"padding": "1%"}}>
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
                        <TableRowColumn colSpan="2" >
                           <h4 style={{float: 'left', "marginLeft":"-5%","padding":"3%","fontWeight": "bold"}}>Variable(s)</h4>
                        </TableRowColumn>
                        </TableRow>
                        <TableRow>
                         <TableRowColumn colSpan={1} tooltip="Variable code" style={{"fontWeight": "bold"}}>Variable code</TableRowColumn>
                         <TableRowColumn colSpan={1} tooltip="Variable value" style={{"fontWeight": "bold"}}>Variable value</TableRowColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody
                         displayRowCheckbox={false}
                         showRowHover={true}
                        >
                        {_.map(this.props.variables, (vari) => (
                          <TableRow key={vari._id}
                            onChange={ (evt) => {
                            }}
                            style={{'cursor':'pointer'}}
                          >
                          <TableRowColumn colSpan={1}>{vari.varCode}</TableRowColumn>
                          <TableRowColumn colSpan={1}>{vari.varValue}</TableRowColumn>
                          </TableRow>
                          ))}
                        </TableBody>
                        </Table>
                        </Paper>
                        </div>
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
        )
    }
}
export default withRouter(Variables)
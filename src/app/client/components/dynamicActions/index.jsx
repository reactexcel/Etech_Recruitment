import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import _ from 'lodash'
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';
const classNames = require('classnames');

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
  lable:{
    fontWeight:'normal',
    fontSize:15
  },
  chip:{
    margin: 4,
    display:"inline",
    padding:4
  },
  container: {
    position: 'relative',
    textAlign:'center',
    paddingTop:'200px'
  },
  toggle: {
    marginBottom: 16,
  },
  formInput:{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "60%"
  },
};
class DynamicActions extends React.Component {
  constructor( props ){
        super( props );
        this.state={
            paper:'show',
            actionName:'',
            actionId:'',
            tmppage:'row',
            tmpcreat:'hidden',
            openDialog:false,
            dialogTitle:'',
            errName:'',
            dependentAction:'',
            templateId:'',
            snackbarOpen:false,
            snackbarmsg:'',
            tagValue:'',
            tagError:'',
            tempValue:'',
            tempError:'',
            floatingLabelText:'Action Name',
            hintText:'Enter Action Name',
            loader:'hidden',
            progressToggle:false,
            pPointValue:1,
            pPointError:'',
            showReportToggle:false,
            dependentActionList:[]
        }
        this.saveAction  = this.saveAction.bind( this )
        this.openCreateAction  = this.openCreateAction.bind( this );
        this.handleClose=this.handleClose.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
        this.editAction = this.editAction.bind(this);
        this.regExp= {
          "pPoint" : /^[0-9]+$/
        }
    }
    componentWillMount(){
        if (!Meteor.userId()) {
            this.props.router.push('/login');
        }
        this.setState({
          loader:'show',
          paper:'hidden'
        })
        this.props.onFetchActions().then( (data) => {
        this.setState({
          snackbarOpen:true,
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
    changeDependentAction = (event,index,value) =>{
      this.setState({
        dependentAction:value
      })
    }
    changeTag = (event, index, value) =>{ 
      this.setState({
        tagValue:value,
        tagError:''
      });
    }
    changeTemp =(event,index,value)=>{
      this.setState({
         tempValue:value,
         tempError:''
       });
    }
    changePPoint = (event) => {
    this.setState({
      pPointValue: event.target.value,
    });
  };
    openCreateAction(){
      
      if(this.props.dynamicActions.length > 0){
        this.state.dependentActionList.push(<MenuItem value="" key={0} primaryText="           "/>);
        _.map(this.props.dynamicActions,(action, key)=>{
          this.state.dependentActionList.push(<MenuItem value={action._id} key={key+1} primaryText={action.name} />)
        })
      }
      
        this.setState({
          actionName:'',
            openDialog:true,
            dialogTitle:"Create Action",
            errName:'',
            tagValue:'',
            tagError:'',
            tempValue:'',
            tempError:'',
            progressToggle:false,
            showReportToggle:false,
            floatingLabelText:'Action Name',
            hintText:'Enter Action Name',
            pPointError:''
        })
    }
    handleClose(){
      this.setState({titlepop: false});
    }
    handleProgresPoint() {
        this.setState({progressToggle: !this.state.progressToggle});
    }
    handleReport() {
        this.setState({showReportToggle: !this.state.showReportToggle});
    }
    gotoActionPage(){
        this.setState({
          actionName:'',
            openDialog:'',
            dialogTitle:'',
            actionId:'',
            errName:'',
            dependentAction:'',
            tagValue:'',
            tagError:'',
            tempValue:'',
            tempError:'',
            progressToggle:false,
            pPointValue:1,
            showReportToggle:false,
            dependentActionList:[],
            pPointError:''
        })
    }
    saveAction() {
        let name=this.state.actionName.trim()
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
        if(id==""){
            this.props.logging("New action added",Meteor.userId(),"Action name : "+name)
        }else{
            this.props.logging("Action edited",Meteor.userId(),"Action name : "+name)
        }
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
      }
    }
    deleteAction(data){
    this.props.onDeleteAction(data._id).then( () => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:"Action Deleted successfully",
        })
      this.props.logging("Action deleted",Meteor.userId(),"Action name : "+data.name)
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
        })
      })
    }
    editAction(data,evt){
        let actionId = data._id;
        this.setState({
          actionName:data.name,
          tagValue:data.tag_id,
          tempValue:data.template_id,
          openDialog:true,
          dialogTitle:"Edit Action",
          actionId:data._id,
          floatingLabelText:'',
          hintText:'',
          showReportToggle:data.report,
          dependentAction:data.dependentActionId
        })
        if(data.progress_point!=0){
          this.setState({
            progressToggle:true,
            pPointValue:data.progress_point
          })
        }else{
          this.setState({
            progressToggle:false,
            pPointValue:1
          })
          
        }
        if(this.props.dynamicActions.length > 0){
          this.state.dependentActionList.push(<MenuItem value="" key={0} primaryText="           "/>);
        _.map(this.props.dynamicActions,(action, key)=>{
            if(action._id != actionId){
                this.state.dependentActionList.push(<MenuItem value={action._id} key={key+1} primaryText={action.name} />)
             }
        })
      }
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
              onTouchTap={this.gotoActionPage.bind(this)}
              style={{marginRight:5}}
            />,
            <RaisedButton
              label="SAVE"
              primary={true}
              onClick={this.saveAction}
            />,
    ];
      let tagItems=[];
      tagItems.push(<MenuItem value="" key={0} primaryText="           "/>);
      if(this.props.tags.length > 0){
        _.map(this.props.tags,(tag, key)=>{
        if(tag.automatic==false){
            tagItems.push(<MenuItem value={tag._id} key={key+1} primaryText={tag.name} />)
          }
          })
      }
      
        let tempItems=[<MenuItem value="" key={0} primaryText="           "/>];
        if(this.props.emailTemplates.length > 0){
          _.map(this.props.emailTemplates,(template, key)=>{
            tempItems.push(<MenuItem value={template._id} key={key+1} primaryText={template.name} />)
          })
        }
          
      return(
        <div className="col-xs-12 col-sm-12" style={{ "float":"right"}}>
            
            <Dialog
              title={this.state.dialogTitle}
              actions={actions}
              modal={false}
              open={this.state.openDialog}
              onRequestClose={this.gotoActionPage.bind(this)}
              autoScrollBodyContent={true}
            >
            <div>
              <form className="form-inline">
              <div className="form-group" style={styles.formInput}>
              <TextField
                    ref='Name'
                    floatingLabelText={this.state.floatingLabelText}
                    hintText={this.state.hintText}
                    fullWidth={true}
                    errorText={this.state.errName}
                    value={this.state.actionName}
                    onChange={(e)=>{
                      this.setState({
                          actionName: e.target.value,
                      });
                    }}
              />
              </div>
              <div className="form-group" style={styles.formInput}>
              <SelectField
                    value={this.state.dependentAction}
                    onChange={this.changeDependentAction}
                    floatingLabelText="Dependent Action"
                    floatingLabelFixed={true}
                    hintText="Select Dependent Action"
              >
                    {this.state.dependentActionList}
              </SelectField>
              </div>
              <div className="form-group" style={styles.formInput}>
              <SelectField
                    value={this.state.tagValue}
                    onChange={this.changeTag}
                    floatingLabelText="Tags"
                    floatingLabelFixed={true}
                    hintText="Select Tag"
                    errorText={this.state.tagError}
              >
                    {tagItems}
              </SelectField>
              </div>
              <div className="form-group" style={styles.formInput}>
              <SelectField
                    value={this.state.tempValue}
                    onChange={this.changeTemp}
                    floatingLabelText="Templates"
                    floatingLabelFixed={true}
                    hintText="Select Template"
                    errorText={this.state.tempError}
              >
                    {tempItems}
              </SelectField>
              </div>
              <div className="form-group" style={styles.formInput}>
              <div style={styles.block}>
                    <Toggle
                      label="Progress point"
                      labelStyle={styles.lable}
                      defaultToggled={this.state.progressToggle}
                      style={styles.toggle}
                      onToggle={this.handleProgresPoint.bind(this)}
                      toggle={this.state.showReportToggle}
                    />
              </div>
                    { this.state.progressToggle ?
                      <div>
                    <TextField
                            ref='pPoint'
                            floatingLabelText="Set progress point"
                            floatingLabelFixed={true}
                            errorText={this.state.pPointError}
                            value={this.state.pPointValue}
                            onChange={this.changePPoint}
                   />
                   </div>
                      :
                      (
                        <div></div>
                      )
                    }
              </div>
              <div className="form-group" style={styles.formInput}>
              <div style={styles.block}>
                    <Toggle
                      label="Show on Report"
                      labelStyle={styles.lable}
                      defaultToggled={this.state.showReportToggle}
                      style={styles.toggle}
                      onToggle={this.handleReport.bind(this)}
                      toggle={this.state.showReportToggle}
                    />
              </div>
              </div>
              </form>
            </div>
            </Dialog>

        <div className={this.state.tmppage} style={{margin:'0px 4px 0px'}}>
                    <div className="col-xs-12">
                      <div className='row'>
                        <div className='col-xs-12' style={{paddingTop:'10px',paddingRight:'0px'}}>
                          <RaisedButton
                            style={{float:'right',margin:'0px'}}
                            label='Create Action'
                            onClick={this.openCreateAction}
                            primary={true}
                            ></RaisedButton>
                        </div>
                        <div className={this.state.loader} style={styles.container}>
                          <CircularProgress size={1.5} />
                        </div>
                        <div className={this.state.paper} style={{"marginTop":"8%"}}>
                        <Paper  zDepth={2} style={{"padding": "1%"}}>
              <h4 className="h4">Action(s)</h4>
              <Divider />
              <div style={
                {
                  "marginTop": "2%",
                  display: 'flex',
                  flexWrap: 'wrap',
                }
              }>
                {_.map(this.props.dynamicActions, (data, key) => {
                  return  <Chip
                      key={data._id}
                      backgroundColor={data.tag_color}
                      onRequestDelete={(evt) => {
                        evt.stopPropagation();
                        this.deleteAction(data)
                      }}
                      onTouchTap={(evt) => this.editAction(data, evt)}
                      style={{ margin: 4}}>
                      <Avatar
                        backgroundColor={data.tag_color}
                        children={
                          _.upperCase(_.trim(data.name)[0])
                        }
                        >
                      </Avatar>
                      {data.name}
                    </Chip>
                  })}
              </div>
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
export default withRouter(DynamicActions)
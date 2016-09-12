import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import _ from 'lodash'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import Toggle from 'material-ui/Toggle';

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
};
class DynamicActions extends React.Component {
  constructor( props ){
        super( props );
        this.state={
            actionId:'',
            tmppage:'row',
            tmpcreat:'hidden',
            errName:'',
            dependentAction:'',
            dependentAcError:'',
            templateId:'',
            snackbarOpen:false,
            snackbarmsg:'',
            actionEmailValue:null,
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
        this.setState({loader:'show'})
        this.props.onFetchActions().then( (data) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:data.toString(),
          loader:'hidden'
        })
      }).catch( (error) => {
        this.setState({
          snackbarOpen:true,
          snackbarmsg:error.toString(),
          loader:'hidden'
        })
      })
    }
    changeActionEmail = (event,index,value) =>{
      this.setState({
        actionEmailValue:value
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
        _.map(this.props.dynamicActions,(action, key)=>{
          this.state.dependentActionList.push(<MenuItem value={action._id} key={key} primaryText={action.name} />)
        })
      }
      this.refs.Name.input.value='';
        this.setState({
            tmppage:'hidden',
            tmpcreat:'row',
            errName:'',
            actionEmailValue:null,
            tagValue:'',
            tagError:'',
            tempValue:'',
            tempError:'',
            progressToggle:false,
            showReportToggle:false,
            floatingLabelText:'Action Name',
            hintText:'Enter Action Name',
            dependentAcError:''
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
        this.refs.Name.input.value='';
        this.setState({
            tmppage:'row',
            tmpcreat:'hidden',
            actionId:'',
            dependentAction:'',
            tagValue:'',
            tempValue:'',
            actionEmailValue:null,
            progressToggle:false,
            showReportToggle:false,
            progressToggle:false,
            pPointValue:1,
            showReportToggle:false,
            dependentActionList:[]
        })
    }
    saveAction() {
      console.log(this.state.dependentActionList,"After save----")
        let name=this.refs.Name.input.value.trim()
        let actionEmail=this.state.actionEmailValue
        let tagId=this.state.tagValue
        let templateId=this.state.tempValue
        let id = this.state.actionId
        let progress = this.state.progressToggle
        let report = this.state.showReportToggle
        let dependentAction = this.state.dependentAction
        let dependencyClear = false
        if(name!=''){
            this.setState({errName:''})
        }else{
            this.setState({errName:'Required'})
        }
        if(this.state.dependentActionList.length>0){
          if(dependentAction==''){
                this.setState({dependentAcError:'Select depending action'})
          }else{
                this.setState({dependentAcError:''})
                dependencyClear=true
          }

        }else{
                dependencyClear=true
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
          }
        }else{
          progress=0;
        }
        if(name!='' && dependencyClear==true && tagId!='' && templateId!='' && (this.state.pPointValue!='' || progress==false)){
            let action={
              name:name,
              dependentAction:dependentAction, 
              actionEmail:actionEmail, 
              tagId:tagId, 
              templateId:templateId, 
              progress:progress,
              report:report
            }
            this.props.onSaveAction(id,action).then( () => {
                this.refs.Name.input.value='';
        this.setState({
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
      }
    }
    deleteAction(id){
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
    }
    editAction(data){
        this.refs.Name.input.value = data.name;
        let actionId = data._id;
        this.setState({
          actionEmailValue:data.actionEmail,
          tagValue:data.tag_id,
          tempValue:data.template_id,
          tmppage:'hidden',
          tmpcreat:'row',
          actionId:data._id,
          floatingLabelText:'',
          hintText:'',
          showReportToggle:data.report
        })
        if(data.dependentAction==""){
          this.setState({
            dependentActionList:[],
            dependentAction:data.dependentActionId
          })
        }else{
          this.setState({
            dependentAction:data.dependentActionId
          })
        }
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
        _.map(this.props.dynamicActions,(action, key)=>{
            if(action._id != actionId){
                this.state.dependentActionList.push(<MenuItem value={action._id} key={key} primaryText={action.name} />)
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
      let tagItems=[];
      if(this.props.tags.length > 0){
        _.map(this.props.tags,(tag, key)=>{
        if(tag.automatic==false){
            tagItems.push(<MenuItem value={tag._id} key={key} primaryText={tag.name} />)
          }
          })
      }
      
      let emailItem=[];
      if(this.props.smtpDetails.length > 0){
        _.map(this.props.smtpDetails,(email, key)=>{
            emailItem.push(<MenuItem value={email.smtp.emailId} key={key} primaryText={email.smtp.emailId} />)
          })
      }
       
      
        let tempItems=[];
        if(this.props.emailTemplates.length > 0){
          _.map(this.props.emailTemplates,(template, key)=>{
            tempItems.push(<MenuItem value={template._id} key={key} primaryText={template.name} />)
          })
        }
        
        let actions=[];
    
          _.map(this.props.dynamicActions,(data, key)=>{
      actions.push(<div className='col-xs-12' key={key}>
                    <div style={{border:'1px solid gray',borderRadius:'5px', height:'auto',margin:'5px',padding:'5px',background: '#fff',}}>
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Action Name : </span>{data.name}</div>
                    <hr />
                    {data.dependentAction != ""?<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Action Depend On : </span>{data.dependentAction}</div>
                    :""}<hr />
                    {data.actionEmail != null?<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Action Email : </span>{data.actionEmail}</div>
                    :<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Action Email : </span>No Email selected</div>}
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Tag : </span><Chip style={styles.chip} backgroundColor={data.tag_color}>{data.tag_name}</Chip></div>
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>
                    Template : </span>{data.template_name}</div>
                    <hr />
                    {data.progress_point != 0?<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Progress Point : </span>{data.progress_point}</div>
                    :<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Progress Point : </span>Dissabled</div>}
                    <hr />
                    {data.report != false?<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Show Report : </span>Enabled</div>
                    :<div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Show On Report : </span>Dissabled</div>}
                    <hr />
                    <div style={{textAlign:'right'}}>
                    <FlatButton
                    style={{margin:'0px'}}
                    label='Edit'
                    onClick={()=>{this.editAction(data)}}
                    primary={true}
                    ></FlatButton>
                    <FlatButton
                    style={{margin:'0px'}}
                    label='Delete'
                    onClick={()=>{this.deleteAction(data._id)}}
                    primary={true}
                    ></FlatButton>
                    </div>
                    </div>
                </div>
      )
    })
          
              
      return(
        <div className="col-xs-12 col-sm-12" style={{ "float":"right"}}>
            <div className={this.state.tmpcreat} style={{margin:'40px 4px 0px'}}>
            <div className='row' style={{background: '#fff'}}>
                   <div className="col-xs-12" style={{background: 'antiquewhite',padding: '10px',borderBottom: '1px solid gainsboro'}}>
                            <b><i>Create New Action</i></b> <br />
                   </div>
                   <div className="col-xs-12" style={{fontSize: '20px',padding: "10px 20px 20px",borderBottom: '1px solid gainsboro'}}>
                   <TextField
                            ref='Name'
                            floatingLabelText={this.state.floatingLabelText}
                            hintText={this.state.hintText}
                            fullWidth={true}
                            errorText={this.state.errName}
                   />
                   <br />
                   { this.state.dependentActionList.length > 0 ?
                    <div>
                   <SelectField
                    value={this.state.dependentAction}
                    onChange={this.changeDependentAction}
                    floatingLabelText="Dependent Action"
                    floatingLabelFixed={true}
                    hintText="Select Dependent Action"
                    errorText={this.state.dependentAcError}
                   >
                    {this.state.dependentActionList}
                   </SelectField>
                   </div>
                      :""
                    }
                   <SelectField
                    value={this.state.actionEmailValue}
                    onChange={this.changeActionEmail}
                    floatingLabelText="Action Emails"
                    floatingLabelFixed={true}
                    hintText="Select Email"
                   >
                    {emailItem}
                   </SelectField>
                   <br/>
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
                   <br/>
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
                    <div>
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
                    <RaisedButton
                          style={{float:'right',margin:'20px'}}
                          label='Back'
                          onClick={this.gotoActionPage.bind(this)}
                          primary={true}
                   ></RaisedButton>
                   <RaisedButton
                          style={{float:'right',margin:'20px'}}
                          label='save'
                          onClick={this.saveAction}
                          primary={true}
                   ></RaisedButton>
                   </div>
                   </div>
                   
            </div>
            </div>

        <div className={this.state.tmppage} style={{margin:'0px 4px 0px'}}>
                    <div className="col-xs-12">
                      <div className='row'>
                        <div className='col-xs-12' style={{paddingTop:'10px',paddingRight:'28px'}}>
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
                          {actions}
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
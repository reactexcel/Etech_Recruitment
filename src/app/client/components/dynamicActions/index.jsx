import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'
import _ from 'lodash'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';

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
  }
};
class DynamicActions extends React.Component {
  constructor( props ){
        super( props );
        this.state={
            actionId:'',
            tmppage:'row',
            tmpcreat:'hidden',
            errName:'',
            templateId:'',
            snackbarOpen:false,
            snackbarmsg:'',
            value:'',
            tempvalue:'',
            floatingLabelText:'Action Name',
            hintText:'Enter Action Name',
            loader:'hidden'
        }
        this.saveAction  = this.saveAction.bind( this )
        this.openCreateAction  = this.openCreateAction.bind( this );
        this.handleClose=this.handleClose.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
        this.editAction = this.editAction.bind(this);
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

    handleChange = (event, index, value) =>{ 
      this.setState({
        value:value
      });
    }
    handleChangeTemp =(event,index,value)=>{
      this.setState({
         tempvalue:value
       });
    }
    openCreateAction(){
      let filterValue = _.filter(this.props.tags, { 'automatic':false })
      if(filterValue.length > 0){
        this.setState({
          value:filterValue[0]._id,
        })
      }else{
        this.setState({
          value:''
        })
      }
      if(this.props.emailTemplates.length > 0){
        this.setState({
          tempvalue:this.props.emailTemplates[0]._id
        })
      }else{
        this.setState({
          tempvalue:''
        })
      }
      this.refs.Name.input.value='';
        this.setState({
            tmppage:'hidden',
            tmpcreat:'row', 
        })
    }
    handleClose(){
      this.setState({titlepop: false});
    }
    gotoActionPage(){
        this.refs.Name.input.value='';
        this.setState({
            tmppage:'row',
            tmpcreat:'hidden',
            value:'',
            tempvalue:''
        })
    }
    saveAction() {
        let name=this.refs.Name.input.value.trim()
        let templateId=this.state.tempvalue
        let tagId=this.state.value
        let id = this.state.actionId
        if(name!=''){
            this.setState({errName:''})
        }else{
            this.setState({errName:'Required'})
        }
        if(name!='' && tagId!='' && templateId!=''){
            let action={name:name, tagId:tagId, templateId:templateId}
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
        this.setState({
          value:data.tag_id,
          tempvalue:data.template_id,
          tmppage:'hidden',
          tmpcreat:'row',
          actionId:data._id,
          floatingLabelText:'',
          hintText:''
        })
    }
    handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
        });
    };
    render(){

      let items=[];
      if(this.props.tags.length > 0){
        _.map(this.props.tags,(tag, key)=>{
        if(tag.automatic==false){
            items.push(<MenuItem value={tag._id} key={key} primaryText={tag.name} />)
          }
          })
      }
       
      
        let templates=[];
        if(this.props.emailTemplates.length > 0){
          _.map(this.props.emailTemplates,(template, key)=>{
            templates.push(<MenuItem value={template._id} key={key} primaryText={template.name} />)
          })
        }
        
        let actions=[];
    
          _.map(this.props.dynamicActions,(data, key)=>{
      actions.push(<div className='col-xs-12' key={key}>
                    <div style={{border:'1px solid gray',borderRadius:'5px', height:'auto',margin:'5px',padding:'5px',background: '#fff',}}>
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Action Name : </span>{data.name}</div>
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>Tag : </span><Chip style={styles.chip} backgroundColor={data.tag_color}>{data.tag_name}</Chip></div>
                    <hr />
                    <div><span style={{textAlign:'left',fontWeight:'bold',fontSize:'13px',fontStyle:'italic'}}>
                    Template : </span>{data.template_name}</div>
                    
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
                   <div style={
                        {
                          textAlign: 'left',
                          fontSize:'17px',
                        }
                    }>Select Tag:</div>
                   <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange}>
                     {items}
                   </DropDownMenu>
                   <br/>
                   <div style={
                        {
                          textAlign: 'left',
                          fontSize:'17px',
                        }
                    }>Select Template:</div>
                    <DropDownMenu maxHeight={300} value={this.state.tempvalue} onChange={this.handleChangeTemp}>
                     {templates}
                    </DropDownMenu>
                    <div>
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
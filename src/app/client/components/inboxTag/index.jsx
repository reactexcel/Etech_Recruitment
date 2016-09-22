import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import TagForm from './tagForm'
import InboxTagList from './inboxTagList'
import { SketchPicker } from 'react-color';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle'
import Avatar from 'material-ui/Avatar'
import Snackbar from 'material-ui/Snackbar';

export default class InboxTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      colorOpen: false,
      color: '#3882b8',
      applyToAll: false,
      sOpen:false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleColorOpen = this.handleColorOpen.bind(this);
    this.handleColorClose = this.handleColorClose.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.props.toggle(this);
    this.error=[];
  }
  handleOpen () {
    this.setState({open: true});
  }
  handleColorOpen () {
    this.setState({colorOpen: true});
  }

  handleClose () {
    this.setState({open: false});
  }

  handleColorClose () {
    this.setState({colorOpen: false});
  }

  onChange (color) {
    this.setState({color: color.hex});
  }

  render() {
   return (
     <div>
       <Dialog
         title="Add New TAG"
         modal={false}
         open={this.state.open}
         onRequestClose={this.handleClose}
         autoScrollBodyContent={true}
         actions={  [
           <FlatButton
              label="Close"
              primary={true}
              style={{marginRight:5}}
              onClick={this.handleClose}
            />,
           <RaisedButton
             label="Save"
             primary={true}
             onClick={(evt) => {
               if(this.state.applyToAll){
                 this.refs.tagForm.add()
                  .then( (data) => {
                    Meteor.call('applyTagToAll', data );
                    this.setState({applyToAll: false, sOpen:true, message: 'We will process your tags in the background. All email matchs to it will be assigned to it'});
                  })
                  .catch( (err) => {
                    this.setState({applyToAll: false, message: err, sOpen:true});
                  })
              }else{
                this.refs.tagForm.add()
                 .catch( (err) => {
                   this.setState({applyToAll: false, message: err, sOpen:true});
                 })
              }
            }}
           />
          ]}
         children={
           <div>
            <TagForm color={() => (this.state.color)} onAddTag={this.props.onAddTag} handleToggle={this.handleClose} ref='tagForm' toggle={false}/>
             <Dialog
               modal={false}
               open={this.state.colorOpen}
               onRequestClose={this.handleColorClose}
               children={
                 <div style={{width: "20%"}} className='col-sm-12'>
                   <SketchPicker
                     color={ this.state.color }
                     onChangeComplete={ this.onChange }
                     />
                 </div>
               }
               contentStyle={{padding:"0px"}}
               bodyStyle={{padding:"0px opx"}}
               className="container-fluid"
               contentClassName= "row"
               bodyClassName= " col-sm-offset-4 col-sm-12 col-xs-12"
               />
               <div className="form-group" style={{
                 "marginLeft": "5%",
                 "marginRight": "5%",
                 "width": "50%"
               }}>
                 <TextField
                   type="text"
                   floatingLabelText="Tag Color"
                   hintText="Enter Tag Color "
                   fullWidth={true}
                   onClick={() => this.handleColorOpen()}
                   onChange={
                     (evt) =>{
                       this.setState({"color": evt.target.value});
                       if (!evt.target.value.length > 0 ) {
                         this.error.color = "Enter tag Color";
                       }else if (!/^[a-zA-Z0-9#]+$/.test(evt.target.value)) {
                         this.error.color = "Invalid tag color";
                       }else{
                         this.error.color = "";
                       }
                     }
                   }
                   errorText={this.error.color}
                   value={this.state.color}
                   inputStyle={{"color": this.state.color}}
                 />
               </div>
               <div style={{"marginLeft": "5%", "marginRight": "5%",}}>
                 <Checkbox
                   labelStyle={{fontWeight: 'normal'}}
                   label="Apply this tag on all previous emails"
                   checkedIcon={<Avatar size={25} children={<ActionCheckCircle color='#000'/>} />}
                   checked={this.state.applyToAll}
                   onCheck={(evt, checked) => {
                     if(checked)
                      this.setState({applyToAll: true});
                     else{
                      this.setState({applyToAll: false});
                     }
                   }}
                   />
               </div>
             </div>
         }
         contentStyle={{padding:"0px" ,width: "40%"}}
         bodyStyle={{padding:"0px opx"}}
         />
         <Snackbar
            open={this.state.sOpen}
            message={this.state.message}
            autoHideDuration={4000}
            onRequestClose={() => this.setState({sOpen:false})}
          />
     </div>
   );
 }
}

InboxTag.propTypes = {
  toggle: React.PropTypes.func.isRequired,
  onAddTag: React.PropTypes.func.isRequired,
};

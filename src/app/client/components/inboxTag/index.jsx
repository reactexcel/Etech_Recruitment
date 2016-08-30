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

export default class InboxTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      colorOpen: false,
      color: '#3882b8',
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
         children={
           <div>
            <TagForm color={() => (this.state.color)} onAddTag={this.props.onAddTag} handleToggle={this.handleClose}/>
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
             </div>
         }
         contentStyle={{padding:"0px" ,width: "40%"}}
         bodyStyle={{padding:"0px opx"}}     
         />
     </div>
   );
 }
}

InboxTag.propTypes = {
  toggle: React.PropTypes.func.isRequired,
  onAddTag: React.PropTypes.func.isRequired,
};

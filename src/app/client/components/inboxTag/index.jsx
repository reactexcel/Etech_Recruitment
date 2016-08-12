import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import TagForm from './tagForm'
import InboxTagList from './inboxTagList'
import { SketchPicker } from 'react-color';

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
         actions={
           <FlatButton
              label="Close"
              onClick={this.handleClose}
           />
         }
         modal={true}
         open={this.state.open}
         onRequestClose={this.handleClose}
         children={
           <div>
            <TagForm color={() => (this.state.color)} onAddTag={this.props.onAddTag} handleToggle={this.handleClose} />
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
             <div style={{"marginLeft": "2%", padding: "3%"}}>
                <FlatButton
                   label="Select Color"
                   onTouchTap={this.handleColorOpen}
                   labelStyle={{backgroundColor: this.state.color, padding:"10px"}}
                />
              </div>
             </div>
         }
         contentStyle={{padding:"0px" ,width: "40%"}}
         bodyStyle={{padding:"0px opx"}}
         />
       <InboxTagList {...this.props}/>
     </div>
   );
 }
}

InboxTag.propTypes = {
  toggle: React.PropTypes.func.isRequired,
  onAddTag: React.PropTypes.func.isRequired,
  onEditTag: React.PropTypes.func.isRequired,
  onRemoveTag: React.PropTypes.func.isRequired,
  onFetchTag: React.PropTypes.func.isRequired,
  tags: React.PropTypes.any.isRequired,
};

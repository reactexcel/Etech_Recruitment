import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}from 'material-ui/Table';
const classNames = require('classnames');
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { SketchPicker } from 'react-color';

const styles = {
  "formInput":{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "60%"
  },
  "formButton":{
    "marginTop": "2%",
    "marginLeft": "5%"
  }
};

export default class InboxTagList extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      "open" : false,
      colorOpen: false,
      tagName: "",
      color: this.props.color,
      "_id": "",
     };
     this.handleOpen = this.handleOpen.bind(this);
     this.handleClose = this.handleClose.bind(this);
     this.handleColorOpen = this.handleColorOpen.bind(this);
     this.handleColorClose = this.handleColorClose.bind(this);
     this.edit = this.edit.bind(this);
     this.onChange = this.onChange.bind(this);
     this.error=[];
  }

  componentWillMount () {
    this.props.onFetchTag();
  }

  handleOpen (row, evt) {
    this.setState({
      open: true,
      colorOpen: false,
      "_id": row._id,
      tagName: row.name,
      color: row.color,
    });
  }

  handleClose () {
    this.setState({
      open: false,
      colorOpen: false,
      "_id": "",
      tagName: "",
      color: "",
    });
    this.error.tagName = "";
  }

  handleColorOpen ( row ) {
    this.setState({
      open: false,
      colorOpen: true,
      "_id": row._id,
      tagName: row.name,
      color: row.color,
    });
  }

  handleColorClose () {
    this.setState({colorOpen: false});
  }


  edit ( ) {
    if(this.state.tagName.length > 0){
      this.props.onEditTag(this.state.tagName, this.state._id, this.state.color);
      this.handleClose();
    }else{
      this.error.tagName = "Enter tag title";
      this.setState({"tagName": ""});
    }
  }
  onChange (color) {
    this.setState({color: color.hex});
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12" style={{"marginTop": "2%"}}>
            <Paper zDepth={2}>
              <Table
                fixedHeader={true}
                fixedFooter={true}
              >
                <TableHeader
                  adjustForCheckbox={false}
                  displaySelectAll={false}
                >
                  <TableRow>
                    <TableHeaderColumn colSpan="4" >
                      <h4 style={{float: 'left', "marginLeft":"-5%","padding":"3%"}}>Inbox Tags List</h4>
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow>
                    <TableHeaderColumn colSpan="2" tooltip="Title">Title</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Color (click on color to change)">Color</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Edit title">Edit Title</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Delete">Delete</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                  stripedRows={true}
                >
                  {_.map(this.props.tags, (row) => (
                    <TableRow key={row._id}
                    >
                      <TableRowColumn colSpan="2">{row.name}</TableRowColumn>
                      <TableRowColumn>
                        <FlatButton
                          label="   "
                          children={
                            (row.color)
                          }
                          onClick={() => this.handleColorOpen(row)}
                          labelStyle={{"backgroundColor": row.color, "width": "50px","height": "20px", marginLeft: "4px", padding: "5px"}}
                         />
                        </TableRowColumn>
                      <TableRowColumn><IconButton iconClassName="fa fa-pencil-square-o fa-2x" iconStyle={{"color": "#C0CA33"}} onClick={(evt) => this.handleOpen(row, evt)}/></TableRowColumn>
                     <TableRowColumn><IconButton iconClassName="fa fa-times fa-2x" iconStyle={{"color": "#D32F2F"}}  onClick={(evt) => {evt.stopPropagation();this.props.onRemoveTag(row._id)}}/></TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
        <Dialog
          open={this.state.open}
          onRequestClose={this.handleClose}
          children={
            <div>
              <form className="form-inline">
                <div className="form-group" style={styles.formInput}>
                  <TextField
                    type="text"
                    floatingLabelText="Tag Title"
                    hintText="Enter Tag Title "
                    fullWidth={true}
                    onChange={
                      (evt) =>{
                        this.setState({"tagName": evt.target.value});
                        if (!evt.target.value.length > 0 ) {
                          this.error.tagName = "Enter tag title";
                        }else if (!/^[a-zA-Z0-9a!@#$%^&* ]+$/.test(evt.target.value)) {
                          this.error.tagName = "Invalid tag title";
                        }else{
                          this.error.tagName = "";
                        }
                      }
                    }
                    errorText={this.error.tagName}
                    value={this.state.tagName}
                  />
                </div>
                <div className="form-group">
                  <RaisedButton
                    label="Edit Title"
                    primary={true}
                    onClick={this.edit}
                  />
                </div>
              </form>
            </div>
          }
          contentStyle={{padding:"20px", width: "35%"}}
          bodyStyle={{padding:"20px"}}
          >
        </Dialog>
        <Dialog
          modal={false}
          open={this.state.colorOpen}
          onRequestClose={this.handleColorClose}
          children={
            <div style={{width: "50%"}} className='col-sm-12'>
              <div>
                <SketchPicker
                  color={ this.state.color }
                  onChangeComplete={ this.onChange }
                  />
              </div>
              <div style={{marginTop:"2%", marginLeft: "17%"}}>
                  <RaisedButton
                    label="Edit Color"
                    labelStyle={{backgroundColor: this.state.color, padding:"10px"}}
                    onClick={this.edit}
                  />
                </div>
            </div>
          }
          contentStyle={{padding:"0px"}}
          bodyStyle={{padding:"0px opx"}}
          className="container-fluid"
          contentClassName= "row"
          bodyClassName= " col-sm-offset-4 col-sm-12 col-xs-12"
          />
      </div>
    );
  }
}

InboxTagList.propTypes = {
  logging: React.PropTypes.func.isRequired,
  onEditTag: React.PropTypes.func.isRequired,
  onRemoveTag: React.PropTypes.func.isRequired,
  onFetchTag: React.PropTypes.func.isRequired,
  tags: React.PropTypes.any.isRequired,
};

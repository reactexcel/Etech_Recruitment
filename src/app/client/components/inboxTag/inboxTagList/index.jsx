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
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';

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
      snackbarOpen:false,
      snackbarmsg:'',
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
      row: row
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
  handleRequestClose = () => {
        this.setState({
            snackbarOpen: false,
            snackbarmsg:''
        });
    };

  handleColorOpen ( ) {
    this.setState({
      open: true,
      colorOpen: true,
      color: this.state.color,
    });
  }

  handleColorClose () {
    this.setState({colorOpen: false});
  }


  edit ( ) {
    if(this.state.tagName.length > 0){
      this.props.onEditTag(this.state.tagName, this.state._id, this.state.color);
      this.handleClose();
      this.handleColorClose();
    }else{
      this.error.tagName = "Enter tag title";
      this.setState({"tagName": ""});
    }
  }
  onChange (color) {
    this.setState({color: color.hex});
  }
  render() {
    const actions = [
      <FlatButton
              label="Close"
              primary={true}
              onTouchTap={this.handleClose}
              style={{marginRight:5}}
            />,
            <RaisedButton
              label="Save"
              primary={true}
              onClick={this.edit}
            />,
    ];
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12"
            style={
              {
                "marginTop": "2%",
              }
            }
          >
            <Paper zDepth={2} style={{"padding": "1%"}}>
              <h4 className="h4">Default tag(s)</h4>
              <Divider />
              <div style={
                {
                  "marginTop": "2%",
                  display: 'flex',
                  flexWrap: 'wrap',
                }
              }>
                {_.map(this.props.tags, (row) => {
                  if(row.default)
                    return <Chip
                      key={row._id}
                      backgroundColor={row.color}
                      style={{ margin: 4}}>
                      <Avatar
                        backgroundColor={row.color}
                        children={
                          _.upperCase(_.trim(row.name)[0])
                        }
                        >
                      </Avatar>
                      {row.name}
                    </Chip>
                  })}
              </div>
            </Paper>
            <Paper zDepth={2} style={{"padding": "1%", marginTop: "2%"}}>
              <h4 className="h4">Manual tag(s)</h4>
              <Divider />
              <div style={
                {
                  "marginTop": "2%",
                  display: 'flex',
                  flexWrap: 'wrap',
                }
              }>
                {_.map(this.props.tags, (row) => {
                  if(!row.automatic && !row.default)
                  return  <Chip
                      key={row._id}
                      backgroundColor={row.color}
                      onRequestDelete={(evt) => {
                        evt.stopPropagation();
                        this.props.onRemoveTag(row._id).then(()=>{
                          this.setState({
                            snackbarOpen:true,
                            snackbarmsg:"Tag Deleted successfully",
                          })
                        }).catch( (error) => {
                           this.setState({
                             snackbarOpen:true,
                             snackbarmsg:error.toString(),
                          })
                        })
                      }}
                      onTouchTap={(evt) => this.handleOpen(row, evt)}
                      style={{ margin: 4}}>
                      <Avatar
                        backgroundColor={row.color}
                        children={
                          _.upperCase(_.trim(row.name)[0])
                        }
                        >
                      </Avatar>
                      {row.name}
                    </Chip>
                  })}
              </div>
            </Paper>
            <Paper zDepth={2} style={{"padding": "1%", marginTop: "2%"}}>
              <h4 className="h4">Automatic tag(s)</h4>
              <Divider />
              <div style={
                {
                  "marginTop": "2%",
                  display: 'flex',
                  flexWrap: 'wrap',
                }
              }>
                {_.map(this.props.tags, (row) => {
                  if(row.automatic)
                    return <Chip
                      key={row._id}
                      backgroundColor={row.color}
                      onRequestDelete={(evt) => {
                        evt.stopPropagation();
                        this.props.onRemoveTag(row._id).then(()=>{
                          this.setState({
                            snackbarOpen:true,
                            snackbarmsg:"Tag Deleted successfully",
                          })
                        }).catch( (error) => {
                           this.setState({
                             snackbarOpen:true,
                             snackbarmsg:error.toString(),
                          })
                        })
                      }}
                      onTouchTap={(evt) => this.handleOpen(row, evt)}
                      style={{ margin: 4}}>
                      <Avatar
                        backgroundColor={row.color}
                        children={
                          _.upperCase(_.trim(row.name)[0])
                        }
                        >
                      </Avatar>
                      {row.name}
                    </Chip>
                  })}
              </div>
            </Paper>
          </div>
        </div>
        <Dialog
          title="Edit Tag"
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          modal={true}
          autoScrollBodyContent={true}
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
                <div className="form-group" style={styles.formInput}>
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
                {
                this.state.row?
                  this.state.row.automatic?(
                    <div>
                      <div className="form-group" style={styles.formInput}>
                        <TextField
                          type="Email"
                          floatingLabelText="Email"
                          fullWidth={true}
                          value={this.state.row.email || 'Not specified'}
                          disabled={true}
                        />
                      </div>
                      <div className="form-group" style={styles.formInput}>
                        <TextField
                          type="Subject"
                          floatingLabelText="Subject"
                          fullWidth={true}
                          value={this.state.row.subject || 'Not specified'}
                          disabled={true}
                          />
                      </div>
                      <div className="form-group" style={styles.formInput}>
                        <TextField
                          type="From date"
                          floatingLabelText="From date"
                          fullWidth={true}
                          value={this.state.row.from || 'Not specified'}
                          disabled={true}
                        />
                      </div>
                      <div className="form-group" style={styles.formInput}>
                        <TextField
                          type="To date"
                          floatingLabelText="To date"
                          fullWidth={true}
                          value={this.state.row.to || 'Not specified'}
                          disabled={true}
                        />
                      </div>
                    </div>):'':''
                }
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
            </div>
          }
          contentStyle={{padding:"0px"}}
          bodyStyle={{padding:"0px opx"}}
          className="container-fluid"
          contentClassName= "row"
          bodyClassName= " col-sm-offset-4 col-sm-12 col-xs-12"
          />
          <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarmsg}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
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

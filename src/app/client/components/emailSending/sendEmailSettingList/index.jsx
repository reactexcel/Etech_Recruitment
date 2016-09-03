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
import Snackbar from 'material-ui/Snackbar';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

export default class SendEmailSettingList extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      "open" : false,
      "title": "",
      "snackbar":false,
      "msg":'',
     };
    this.select = this.select.bind(this);
    this.checkMailServer = this.checkMailServer.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.delete = this.delete.bind(this);
    this.flag = 0;
  }
    componentWillUpdate () {
    if (this.flag % 4 == 0) {
      this.handleClose();
      this.flag = 0 ;
    }
  }
  delete(row_id, event){
    event.stopPropagation();
    this.props.onDeleteRow(row_id).then((responce)=>{
      this.setState({
        snackbar:true,
        msg:responce.toString(),
      })
    }).catch((err)=>{
      this.setState({
        snackbar:true,
        msg:err.toString(),
      })
    })
  }
  handleOpen (email) {
    this.setState({
      "open" : true,
      "title": "Testing for Email: "+ email,
    });
    this.flag++;
  };

  handleClose () {
    this.setState({
      "open" : false,
      "title": "",
    });
  };

  select(row, checked){
    this.props.selectedRow(row, checked);
  }
checkMailServer( row, event ){
    event.stopPropagation();
    this.handleOpen(row.smtp.emailId);
    this.props.onTestDetails( row ).then( (response) => {
      this.handleClose()
      if(response){
      this.setState({
        snackbar:true,
        msg:'Email server test completed successfully',
      })
      }else{
       this.setState({
        snackbar:true,
        msg:'Email server test failed',
      }) 
      }
    }).catch((err)=>{
      this.handleClose()
      this.setState({
      snackbar:true,
      msg:'Email server setting test failed. Please correct your data',
      })
    });
  }


  render() {
    this.flag++;
    let rowdata = [];
    _.map(this.props.emailSetting, (row) => {
                    if(typeof row.smtp != 'undefined'){
                     rowdata.push(row)
                    }
                    })
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12" style={{"marginTop": "2%"}}>
            <Paper zDepth={2}>
              <Table
                fixedHeader={true}
                fixedFooter={true}
                onRowSelection={
                  (rowNumber) => {
                    rowNumber.length == 1 ?this.select(this.props.emailSetting[rowNumber], true)
                      :null;
                  }
                }
              >
                <TableHeader
                  adjustForCheckbox={false}
                  displaySelectAll={false}
                >
                  <TableRow>
                    <TableRowColumn colSpan="4" >
                      <h4 style={{float: 'left', "marginLeft":"-5%","padding":"3%","fontWeight": "bold"}}>SMTP Settings</h4>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn colSpan={2} tooltip="Email ID" style={{"fontWeight": "bold"}}>Email ID</TableRowColumn>
                    <TableRowColumn tooltip="Server" style={{"fontWeight": "bold"}}>Server</TableRowColumn>
                    <TableRowColumn tooltip="Port" style={{"fontWeight": "bold"}}>Port</TableRowColumn>
                    <TableRowColumn tooltip="Encrypt" style={{"fontWeight": "bold"}}>Encrypt</TableRowColumn>
                    <TableRowColumn tooltip="status" style={{"fontWeight": "bold"}}>Status</TableRowColumn>
                    <TableRowColumn tooltip="Test" style={{"fontWeight": "bold"}}>Test </TableRowColumn>
                    <TableRowColumn tooltip="Delete" style={{"fontWeight": "bold"}}>Delete </TableRowColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                >
                  {_.map(rowdata,(row)=>(
                      <TableRow key={row._id}
                      onChange={ (evt) => {this.select(row, evt.target.checked)}}
                    >
                      <TableRowColumn colSpan={2}>{row.smtp.emailId}</TableRowColumn>
                      <TableRowColumn>{row.smtp.server}</TableRowColumn>
                      <TableRowColumn>{row.smtp.port}</TableRowColumn>
                      <TableRowColumn>{row.smtp.encrypt}</TableRowColumn>
                      <TableRowColumn><IconButton iconClassName={
                          classNames("fa" ,"fa-2x",
                                      {"fa-check": (row.smtp.status == 1)},
                                      {"fa-times": (row.smtp.status == -1)},
                                      {"fa-minus": (row.smtp.status == 0)},
                                     )
                       } iconStyle={{"color":(row.smtp.status == 1?"#8BC34A":((row.smtp.status == -1)?"#B71C1C":"#424242"))}}/></TableRowColumn>
                     <TableRowColumn><FlatButton label="Test" secondary={true} onClick={(evt) => this.checkMailServer(row, evt)}/></TableRowColumn>
                     <TableRowColumn><FlatButton label="Remove" secondary={true} onClick={(evt) => this.delete(row._id, evt)}/></TableRowColumn> 
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
            <div>
              <Dialog
                title={this.state.title}
                modal={true}
                open={this.state.open}
                onRequestClose={this.handleClose}
                children={ 
                  <CircularProgress size={1} />
                }
                bodyStyle={{marginLeft: "35%",borderRadius: " 100px", border:"1px solid transparent"}}
                titleClassName = "text-center text-muted"
                titleStyle={{"color": "#666"}}
                contentStyle={{width: "30%", borderRadius: "100px", border:"1px solid transparent" }}
                ></Dialog>
                <Snackbar
          open={this.state.snackbar}
          message={this.state.msg}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SendEmailSettingList.propTypes = {
  selectedRow: PropTypes.func.isRequired,
  onTestDetails: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

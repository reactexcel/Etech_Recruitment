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

export default class EmailSettingList extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      "open" : false,
      "title": "",
     };
    this.select = this.select.bind(this);
    this.checkMailServer = this.checkMailServer.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.flag = 0;
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
    this.handleOpen(row.emailId)
    this.props.onTestDetails( row );
  }
  componentWillUpdate () {
    if (this.flag % 4 == 0) {
      this.handleClose();
      this.flag = 0 ;
    }
  }
  render() {
    this.flag++;
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
                    <TableHeaderColumn colSpan="4" >
                      <h4 style={{float: 'left', "marginLeft":"-5%","padding":"3%"}}>IMAP/POP3 Settings</h4>
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow>
                    <TableHeaderColumn colSpan={2} tooltip="Email ID">Email ID</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Server">Server</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Port">Port</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Encrypt">Encrypt</TableHeaderColumn>
                    <TableHeaderColumn tooltip="status">Status</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Test">Test </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                  stripedRows={true}
                >
                  {_.map(this.props.emailSetting, (row) => (
                    <TableRow key={row._id}
                      onChange={ (evt) => {this.select(row, evt.target.checked)}}
                    >
                      <TableRowColumn colSpan={2}>{row.emailId}</TableRowColumn>
                      <TableRowColumn>{row.server}</TableRowColumn>
                      <TableRowColumn>{row.port}</TableRowColumn>
                      <TableRowColumn>{row.encrypt}</TableRowColumn>
                      <TableRowColumn><IconButton iconClassName={
                          classNames("fa" ,"fa-2x",
                                      {"fa-check": (row.status == 1)},
                                      {"fa-times": (row.status == -1)},
                                      {"fa-minus": (row.status == 0)},
                                     )
                       } iconStyle={{"color":(row.status == 1?"#8BC34A":((row.status == -1)?"#B71C1C":"#424242"))}}/></TableRowColumn>
                     <TableRowColumn><FlatButton label="Test" primary={true} onClick={(evt) => this.checkMailServer(row, evt)}/></TableRowColumn>
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EmailSettingList.propTypes = {
  selectedRow: PropTypes.func.isRequired,
  onTestDetails: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

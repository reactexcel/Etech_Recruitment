import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Toggle from 'material-ui/Toggle';
import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}from 'material-ui/Table';

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
    this.select = this.select.bind(this);
  }

  select(row, checked){
    this.props.selectedRow(row, checked);
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
                onRowSelection={
                  (rowNumber) => {
                    rowNumber.length == 1 ?this.select(this.props.emailSetting[rowNumber], true)
                      :null;
                  }
                }
              >
                <TableHeader
                  adjustForCheckbox={true}
                >
                  <TableRow>
                    <TableHeaderColumn colSpan="4"  >
                      <h4 style={{float: 'left', "marginLeft":"-5%","padding":"3%"}}>IMAP/POP3 Settings</h4>
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow>
                    <TableHeaderColumn tooltip="Email ID">Email ID</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Server">Server</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Port">Port</TableHeaderColumn>
                    <TableHeaderColumn tooltip="Encrypt">Encrypt</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={true}
                  showRowHover={true}
                  stripedRows={true}
                >
                  {_.map(this.props.emailSetting, (row) => (
                    <TableRow key={row._id}
                      onChange={ (evt) => {this.select(row, evt.target.checked)}}
                    >
                      <TableRowColumn>{row.emailId}</TableRowColumn>
                      <TableRowColumn>{row.server}</TableRowColumn>
                      <TableRowColumn>{row.port}</TableRowColumn>
                      <TableRowColumn>{row.encrypt}</TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

EmailSettingList.propTypes = {
  selectedRow: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

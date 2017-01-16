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
import ActionDone from 'material-ui/svg-icons/action/done';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';

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
      show:false,
      sOpen: false,
      snakMsg: '',
     };
    this.select = this.select.bind(this);
    this.checkMailServer = this.checkMailServer.bind(this);
    this.removeMailServer = this.removeMailServer.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.flag = 0;
  }

  handleOpen (email) {
    this.setState({
      "open" : true,
      "title": "Testing for Email: "+ email,
    });
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
  removeMailServer( row, event ){
    event.stopPropagation();
    this.props.onRemoveDetails( row._id );
  }
  componentWillUpdate () {
    if(this.props.uiLoading && this.state.open){
      this.handleClose () ;
    }
  }
  onStartCron( _id ){
    this.props.onStartCron( _id )
    .then( (data) => {
      this.setState({snakMsg: data, sOpen: true});
    })
    .catch( (err) => {
      this.setState({snakMsg: err, sOpen: true});
    })
  }

  render() {
    let rowdata = [];
    _.map(this.props.emailSetting, (row) => {
        if(typeof row.smtp == 'undefined' &&  row.emailId != ''){
          rowdata.push(row)
        }
      })
    const actions = [
      <RaisedButton
        label="Stop"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];
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
                      <h4 style={{float: 'left', "marginLeft":"-5%","padding":"3%","fontWeight": "bold"}}>IMAP/POP3 Settings</h4>
                    </TableRowColumn>
                  </TableRow>
                  <TableRow>
                    <TableRowColumn colSpan={2} tooltip="Email ID" style={{"fontWeight": "bold"}}>Email ID</TableRowColumn>
                    <TableRowColumn colSpan={2} tooltip="Server" style={{"fontWeight": "bold"}}>Server</TableRowColumn>
                    <TableRowColumn tooltip="Port" style={{"fontWeight": "bold", textAlign:'center'}}>Port</TableRowColumn>
                    <TableRowColumn tooltip="Encrypt" style={{"fontWeight": "bold", textAlign:'center'}}>Encrypt</TableRowColumn>
                    <TableRowColumn tooltip="status" style={{"fontWeight": "bold"}}>Status</TableRowColumn>
                    <TableRowColumn tooltip="Test" style={{"fontWeight": "bold"}}>Active</TableRowColumn>
                    <TableRowColumn tooltip="Test" style={{"fontWeight": "bold"}}>Test</TableRowColumn>
                    <TableRowColumn tooltip="Remove" style={{"fontWeight": "bold", textAlign:'center', padding:'0px'}}>Remove</TableRowColumn>
                    <TableRowColumn tooltip="Remove" style={{"fontWeight": "bold"}}>Statics</TableRowColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  displayRowCheckbox={false}
                  showRowHover={true}
                >
                  {_.map(rowdata, (row) => (
                    <TableRow key={row._id}
                      onChange={ (evt) => {this.select(row, evt.target.checked)}}
                    >
                      <TableRowColumn colSpan={2}>{row.emailId}</TableRowColumn>
                      <TableRowColumn colSpan={2}>{row.server}</TableRowColumn>
                      <TableRowColumn style={{textAlign:'center'}}>{row.port}</TableRowColumn>
                      <TableRowColumn style={{textAlign:'center'}}>{row.encrypt}</TableRowColumn>
                      <TableRowColumn><IconButton iconClassName={
                          classNames("fa" ,"fa-2x",
                                      {"fa-check": (row.status == 1)},
                                      {"fa-times": (row.status == -1)},
                                      {"fa-minus": (row.status == 0)},
                                     )
                       }
                       style={{textAlign:'center'}}
                       iconStyle={{"color":(row.status == 1?"#8BC34A":((row.status == -1)?"#B71C1C":"#424242")), fontSize:"18px" }}/></TableRowColumn>
                     <TableRowColumn><IconButton
                        iconClassName={
                          classNames("fa" ,"fa-2x","fa-power-off")
                          }
                          iconStyle={{"color":(row.active?"#8BC34A":"#B71C1C"),fontSize:"18px"}}
                        onClick= {
                         (evt) => {
                           evt.stopPropagation();
                           this.props.onActiveIMAPEmail(row._id);
                         }
                       }
                       />
                     </TableRowColumn>
                     <TableRowColumn style={{padding:"0px"}}><FlatButton labelStyle={{padding:'0px'}} labelPosition='before' label="Test" secondary={true} onClick={(evt) => this.checkMailServer(row, evt)}/></TableRowColumn>
                     <TableRowColumn style={{padding:"10px"}}><FlatButton labelStyle={{padding:'0px'}} label="Remove" secondary={true} onClick={(evt) => this.removeMailServer(row, evt)}/></TableRowColumn>
                     <TableRowColumn><IconButton iconClassName = 'fa fa-bar-chart fa-1x' iconStyle={{color:"#EC407A", fontSize:"15px"}} onClick={(evt) => { evt.stopPropagation(); this.setState({ stat: true, imapEmail:row})}}/></TableRowColumn>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
            <div>
              <Dialog
                title={this.state.title}
                actions={actions}
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
            <div>
              <Dialog
                title={typeof this.state.imapEmail !== 'undefined'?'Statics of ' + this.state.imapEmail.emailId:''}
                actions={<FlatButton primary={true} label='close' onTouchTap={(evt) => { this.setState({ stat: false})}}/>}
                modal={false}
                open={this.state.stat}
                onRequestClose={() => { this.setState({ stat: false})}}
                autoScrollBodyContent={true}
                children={
                  this.state.imapEmail?
                  <div>
                      <h4 style={{ lineHeight: "120%", textAlign:'justify'}} className="">
                        Current (new) e-mail fetching process details
                      </h4>
                    <p style={{ lineHeight: "120%", textAlign:'justify', marginLeft:'5%'}}>
                      New Emali(s): {this.state.imapEmail.status_last_fetch_details.newMailFound}<br/>
                      Last Update date: {this.state.imapEmail.status_last_fetch_details.last_email_fetch_date}<br/>
                      Last Update time: {this.state.imapEmail.status_last_fetch_details.time}<br/>
                      Total emails fetched: {this.state.imapEmail.status_last_fetch_details.totalEmailFetched}<br/>
                    </p>
                    { typeof this.state.imapEmail.cronDetail !== 'undefined'?
                    <div>
                      <br/>
                        <h4 style={{ lineHeight: "120%", textAlign:'justify'}}>
                          Cron (old) e-mail fetching process details
                        </h4>
                        <p style={{ lineHeight: "120%", textAlign:'justify', marginLeft:'5%'}}>
                          Last fetched email of date: {this.state.imapEmail.cronDetail.lastEmailDate}<br/>
                          Last update time : {this.state.imapEmail.cronDetail.time}<br/>
                          Total emails fetched: {this.state.imapEmail.cronDetail.totalEmailFetched}<br/>
                          Total count of Inbox emails: {this.state.imapEmail.cronDetail.totalMailInInbox}<br/>
                        </p>
                        {this.state.imapEmail.cronDetail.totalEmailFetched/this.state.imapEmail.cronDetail.totalMailInInbox*100 <= 100?
                          <LinearProgress mode="determinate" value={this.state.imapEmail.cronDetail.totalEmailFetched/this.state.imapEmail.cronDetail.totalMailInInbox*100} />
                          :""
                        }
                      </div>
                      :this.state.imapEmail.croned?<LinearProgress />:''
                    }
                    <br/>
                    <div>
                      <Toggle
                        label={this.state.imapEmail.croned?(this.state.imapEmail.cronDetail !== 'object'?("This email is being processed in background."):this.state.imapEmail.cronDetail.totalEmailFetched==this.state.imapEmail.cronDetail.totalMailInInbox?"All emails has been featched":"This email is being processed in background.")
                          :"Start cron to fetch all email from the selected email"}
                        disabled={this.state.imapEmail.croned}
                        defaultToggled={this.state.imapEmail.croned}
                        labelPosition="right"
                        labelStyle={{fontWeight:'normal', color:'#555'}}
                        onToggle={ () => {
                          this.onStartCron( this.state.imapEmail._id)
                          this.setState({ stat: false})
                          }
                        }
                      />
                    </div>
                  </div>:''
                }
                titleClassName = "text-center text-muted"
                contentStyle={{width: "40%"}}
                bodyStyle={{ paddingTop:"5%"}}
                ></Dialog>
            </div>
          </div>
        </div>
        <Snackbar
         open={this.state.sOpen}
         message={this.state.snakMsg}
         autoHideDuration={5000}
         onRequestClose={() => this.setState({sOpen: false})}
       />
      </div>
    );
  }
}

EmailSettingList.propTypes = {
  selectedRow: PropTypes.func.isRequired,
  onTestDetails: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

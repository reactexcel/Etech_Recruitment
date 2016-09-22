import React, {PropTypes} from 'react';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import {MenuItem} from 'material-ui/Menu';
import LogoImg from './../../assets/images/logo.png';

export default class MenuDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {"open": false}
    this.handleClose = this.handleClose.bind(this);
    this.logout = this.logout.bind(this);
  }
  logout(path){

    Accounts.logout((err)=>{
      if(!err){
        this.handleClose(path)

      }
    })
  }
  handleClose(path){
    this.setState({open: false});
    this.props.handleClose();
    if(path !== "")
      this.props.router.push(path);
  }

  render() {
    return (
      <Drawer
        docked={false}
        width={null}
        open={this.props.open}
        onRequestChange={(open) => { this.setState({"open": false}); this.props.requestChange(open)}}
        swipeAreaWidth={100}
        docked={false}
      >
      <div style={{"backgroundColor":"#2e3e4e","textAlign": "center", padding:"30px"}}><img src={LogoImg}/></div>
        <Divider/>
        <MenuItem onTouchTap={() => this.handleClose("/dashboard")}>Dashboard</MenuItem>
        <Divider/>
        <MenuItem onTouchTap={() => this.handleClose("/inbox")}>Inbox</MenuItem>
        <Divider/>
        <MenuItem onTouchTap={() => this.handleClose("display/logs")}>User Activity Logs</MenuItem>
        <Divider/>
        <MenuItem onTouchTap={()=>{this.handleClose("/config")}}>Settings</MenuItem>
        <Divider/>
        <MenuItem onTouchTap={()=>{this.handleClose("/changepassword")}}>Change Password</MenuItem>
        <Divider/>
        <MenuItem onTouchTap={()=>{this.logout("/login")}}>Logout</MenuItem>
        <Divider/>
      </Drawer>
    );
  }
}

MenuDrawer.propTypes = {
  "open": PropTypes.bool.isRequired,
  "router": PropTypes.any.isRequired,
  "handleClose": PropTypes.func.isRequired,
  "requestChange": PropTypes.func.isRequired,
};

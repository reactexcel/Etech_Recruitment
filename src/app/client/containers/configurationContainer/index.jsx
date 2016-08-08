import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import {withRouter} from 'react-router';
import {Menu, MenuItem} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

class ConfigurationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={"open": false}
    this.handleToggel = this.handleToggel.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggel(){
    this.setState({open: !this.state.open});
  }

  handleClose(path){
    this.setState({open: false});
    if(path !== "")
      this.props.router.push(path);
  }

  render() {
    return (
        <div>
          <AppBar
            title={_.isEmpty(_.upperFirst(_.split(this.props.location.pathname,'/')[2]))
              ?"Settings"
              :_.upperFirst(_.split(this.props.location.pathname,'/')[2])
            }
            showMenuIconButton={true}
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                  <MenuItem primaryText="Refresh" />
                  <MenuItem primaryText="Help" />
                  <MenuItem primaryText="Sign out" />
              </IconMenu>
            }
            iconElementLeft={<IconButton onTouchTap={this.handleToggel}><NavigationMenu /></IconButton>}
            zDepth={2}
            />
          <div className="col-lg-3 col-sm-3 col-xs-12">
            <Menu desktop={true} style={{"float": "left"}}>
              <MenuItem primaryText="IMAP server setting" onTouchTap={()=>{this.props.router.push("config/emailSetting");}}/>
              <Divider />
              <MenuItem primaryText="Database setting" value="config/emailSetting" onTouchTap={this.redirect}/>
              <Divider />
              <MenuItem primaryText="Inbox setting" value="config/emailSetting" onTouchTap={this.redirect}/>
              <Divider />
              <MenuItem primaryText="Menu Item" value="config/emailSetting" onTouchTap={this.redirect}/>
            </Menu>
          </div>
          <div className="col-lg-9 col-sm-9 col-xs-12 well well-lg" style={{"height": "100%"}}>
            {this.props.children}
          </div>
          <Drawer
            docked={false}
            width={null}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open:false})}
            swipeAreaWidth={100}
            docked={false}
          >
            <h3 className="text-center"> Menu</h3>
            <Divider />
            <MenuItem onTouchTap={()=>{this.handleClose("/")}}>Home</MenuItem>
            <MenuItem onTouchTap={this.handleClose}>Inbox</MenuItem>
            <MenuItem onTouchTap={this.handleClose}>Candidate Liat</MenuItem>
            <MenuItem onTouchTap={()=>{this.handleClose("/config")}}>Settings</MenuItem>
          </Drawer>
        </div>
    );
  }
}

export default withRouter(ConfigurationContainer);

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
import MenuDrawer from '../../components/menuDrawer';
import verge from 'verge';

class ConfigurationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={"open": false}
    this.handleToggel = this.handleToggel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.requestChange = this.requestChange.bind(this);
  }

  handleToggel(){
    this.setState({open: !this.state.open});
  }

  handleClose(){
    this.setState({open: !this.state.open});
  }

  requestChange(open){
    this.setState({"open": open});
  }

  render() {
    return (
        <div>
          <AppBar
            title={_.isEmpty(_.upperFirst(_.split(this.props.location.pathname,'/')[2]))
              ?"Settings"
              :_.map(_.split(_.split(this.props.location.pathname,'/')[2],'-'), (v)=>(_.upperFirst(v)+" "))
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
          <div className="col-lg-2 col-sm-2 col-xs-12" style={{"height": verge.viewportH()+"px", "padding":"0px", "backgroundColor":"#fff"}}>
            <Menu desktop={true} style={{ hight:"100%", "float":"left"}}>
              <MenuItem  primaryText="IMAP server setting" onTouchTap={()=>{this.props.router.push("/config/email-server-setting");}}/>
              <MenuItem  primaryText="Database setting" value="config/emailSetting" onTouchTap={this.redirect}/>
            </Menu>
          </div>
          <div className="col-lg-10 col-sm-10 col-xs-12" style={{"marginTop": "1%"}}>
            {this.props.children}
          </div>
          <MenuDrawer
            open={this.state.open}
            router={this.props.router}
            handleClose={this.handleClose}
            requestChange={this.requestChange}
          />
        </div>
    );
  }
}

export default withRouter(ConfigurationContainer);

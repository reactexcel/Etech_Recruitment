import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import {Menu, MenuItem} from 'material-ui/Menu';
import Header from '../../components/generic/Header';
import verge from 'verge';
import _ from 'lodash';

class ConfigurationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={"open": false}
    this.handleToggel = this.handleToggel.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.requestChange = this.requestChange.bind(this);
  }
  componentWillMount(){
      if (!Meteor.userId()) {
        this.props.router.push('/login');
      }
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
          <Header {...this.props} position={2} altr="Settings" />
          <div className="col-lg-2 col-sm-2 col-xs-12" style={{"height": verge.viewportH()+"px", "padding":"0px", "backgroundColor":"#fff"}}>
            <Menu desktop={true} style={{ hight:"100%", "float":"left"}}>
              <MenuItem  primaryText="IMAP server setting" onTouchTap={()=>{this.props.router.push("/config/email-server-setting");}}/>
              <MenuItem  primaryText="Tag Setting" onTouchTap={()=>{this.props.router.push("/config/tag-setting");}}/>
              <MenuItem  primaryText="Database setting" value="config/emailSetting" onTouchTap={this.redirect}/>
              <MenuItem  primaryText="Email Sending" onTouchTap={()=>{this.props.router.push("/config/email-sending");}}/>
              <MenuItem  primaryText="Email Templates" onTouchTap={()=>{this.props.router.push("/sendmail")}} />
            </Menu>
          </div>
          <div className="col-lg-10 col-sm-10 col-xs-12" style={{"marginTop": "1%"}}>
            {this.props.children}
          </div>
        </div>
    );
  }
}

export default withRouter(ConfigurationContainer);

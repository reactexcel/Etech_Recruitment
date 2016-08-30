import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {withRouter} from 'react-router'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MenuDrawer from '../../components/menuDrawer';
import {Menu, MenuItem} from 'material-ui/Menu';


class DisplayContainer extends React.Component{
      constructor(props){
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
     render(){
		return(
			<div>
      <AppBar
      title="User Activity Logs" 
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
      <div className="col-lg-11 col-sm-11 col-xs-11" style={{"height": "100%","marginTop":"20px","marginLeft":"4%"}}>
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
/*DisplayContainer.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};*/
export default withRouter(DisplayContainer);
import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import {Menu, MenuItem} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MenuDrawer from '../menuDrawer';

class CandidateHistoryHeader extends React.Component {
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
      render(){
      	return(
      		<div>
      		<AppBar
      		title={"Candidate History"}
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
export default CandidateHistoryHeader
import React, {PropTypes} from 'react'
import AppBar from 'material-ui/AppBar';
import {Menu, MenuItem} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuDrawer from '../../components/menuDrawer';

import _ from 'lodash';

class Header extends React.Component {
    constructor( props ){
        super( props );
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
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
    }
    render(){
        return(
          <div>
            <AppBar
              title={_.isEmpty(_.upperFirst(_.split(this.props.location.pathname,'/')[this.props.position]))
                ?this.props.altr || ""
                :_.map(_.split(_.split(this.props.location.pathname,'/')[this.props.position],'-'), (v)=>(_.upperFirst(v)+" "))
              }
              showMenuIconButton={true}
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
        )
    }
}

Header.propTypes = {
  location: PropTypes.any.isRequired,
  position: PropTypes.number.isRequired,
  altr: PropTypes.string,
};

export default Header

import React, {Component,PropTypes} from 'react';
import {withRouter} from 'react-router';
import {Menu, MenuItem} from 'material-ui/Menu';
import Header from '../../components/generic/Header';
import { Roles } from 'meteor/alanning:roles';
import verge from 'verge';
import _ from 'lodash';
import {List, ListItem, MakeSelectable} from 'material-ui/List';


let SelectableList = MakeSelectable(List);
function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}
SelectableList = wrapState(SelectableList);

const style = {
  menu: {
    float: 'left',
    hight:"100%"
  },
  activeItem: {
    color: 'red',
    backgroundColor:'red'
  }
};

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
      this.props.router.push("/config/email-server-setting")
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
          <SelectableList desktop={true} style={style.menu} defaultValue={1}>
          <ListItem
           value={1}
           primaryText="IMAP server setting"
           onTouchTap={()=>{this.props.router.push("/config/email-server-setting");}}
          />
          <ListItem
            value={2}
            primaryText="SMTP server setting"
            onTouchTap={()=>{this.props.router.push("/config/email-sending");}}
          />
          <ListItem
            value={3}
            primaryText="Email Templates"
            onTouchTap={()=>{this.props.router.push("/config/email-templates");}}
          />
          <ListItem
            value={4}
            primaryText="Tag Setting"
            onTouchTap={()=>{this.props.router.push("/config/tag-setting");}}
          />
          <ListItem
            value={5}
            primaryText="Actions"
            onTouchTap={()=>{this.props.router.push("/config/dynamic-actions");}}
          />
          <ListItem
            value={6}
            primaryText="Variables"
            onTouchTap={()=>{this.props.router.push("/config/variables");}}
          />
          {Roles.userIsInRole( Meteor.userId(), 'Admin' )?<ListItem
            value={7}
            primaryText="Manage Users"
            onTouchTap={()=>{this.props.router.push("/config/manageUsers");}}
          />:""}
          
          </SelectableList>
          </div>
          <div className="col-lg-10 col-sm-10 col-xs-12" style={{"marginTop": "1%"}}>
            {this.props.children}
          </div>
        </div>
    );
  }
}

export default withRouter(ConfigurationContainer);

import _ from 'lodash';
import React, {PropTypes} from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import Snackbar from 'material-ui/Snackbar';


class TagMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      msgOpen:false,
      msg:'',
    }
    this.onClick = this.onClick.bind(this);
  }

  onClick ( obj ) {
    this.props.onAssignTag(obj.m_id, obj.t_id).then(()=>{
      this.setState({
        msgOpen:true,
        msg:'Tag Assigned',
      })
    }).catch((err)=>{
      this.setState({
        msgOpen:true,
        msg:err.toString(),
      })
    })
  }

  render() {
    let tagMenu =  _.map(this.props.tags, ( v ) =>{
              return  typeof this.props.email.tags != 'undefined'?
                (_.indexOf(this.props.email.tags, v._id.toString()) < 0?
                <MenuItem
                  primaryText={<Avatar
                    backgroundColor={v.color}
                    size={30}
                    children={
                      _.upperCase(v.name[0])
                    }></Avatar>}
                  secondaryText={v.name}
                  key={v._id}
                  value={v._id+"-"+v.name}
                  onTouchTap={() => this.onClick({"t_id": v._id, m_id: this.props.email._id})}
                  />:<div></div>):
                  <MenuItem
                    primaryText={<Avatar
                      backgroundColor={v.color}
                      size={30}
                      children={
                        _.upperCase(v.name[0])
                      }></Avatar>}
                    secondaryText={v.name}
                    key={v._id}
                    value={v._id+"-"+v.name}
                    onTouchTap={() => this.onClick({"t_id": v._id, m_id: this.props.email._id})}
                    />
              })
    return (
      <div>
        <IconMenu
          iconButtonElement={<IconButton onClick={(e) => e.stopPropagation()}><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
          <MenuItem
            primaryText="Tags"
            insetChildren={true}
            rightIcon={<ArrowDropRight />}
            menuItems={tagMenu}
            />
        </IconMenu>
        <Snackbar
                    open={this.state.msgOpen}
                    message={this.state.msg}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                  />
      </div>
    );
  }
}

TagMenu.propTypes = {
};


export default TagMenu
import _ from 'lodash';
import React, {PropTypes} from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

class TagMenu extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick ( obj ) {
    this.props.AssignTag([obj.m_id], obj.t_id)
  }

  render() {
    let tagMenu=[];
     _.map(this.props.tags, ( v ) =>{
      if(!v.default){
              tagMenu.push(typeof this.props.email.tags != 'undefined'?
                (_.indexOf(this.props.email.tags, v._id.toString()) < 0?
                <MenuItem
                  primaryText={<span><Avatar
                    backgroundColor={v.color}
                    size={30}
                    style={{marginRight:'10px'}}
                    children={
                      _.upperCase((v.name.trim()[0]))
                    }></Avatar>
                  <span>{v.name.trim()}</span></span>}
                  key={v._id}
                  value={v._id+"-"+v.name}
                  onTouchTap={() => this.onClick({"t_id": v._id, m_id: this.props.email._id})}
                  />:<div></div>):
                  <MenuItem
                    primaryText={<span><Avatar
                      backgroundColor={v.color}
                      size={30}
                      style={{marginRight:'10px'}}
                      children={
                        _.upperCase((v.name.trim()[0]))
                      }></Avatar>
                    <span>{v.name.trim()}</span></span>}
                    secondaryText={v.name}
                    key={v._id}
                    value={v._id+"-"+v.name}
                    onTouchTap={() => this.onClick({"t_id": v._id, m_id: this.props.email._id})}

                    />)
                  }else if(v.name == "Schedule"){
                    tagMenu.push(typeof this.props.email.tags != 'undefined'?
                    (_.indexOf(this.props.email.tags, v._id.toString()) < 0?
                      <MenuItem
                        primaryText={<span><Avatar
                        backgroundColor={v.color}
                        style={{marginRight:'10px'}}
                        size={30}
                        children={
                          _.upperCase((v.name.trim()[0]))
                        }></Avatar>
                        <span>{v.name.trim()}</span></span>}
                        key={v._id}
                        value={v._id+"-"+v.name}
                        onTouchTap={() => this.props.onSchedule(true,this.props.email)}
                      />:<div></div>):<div></div>)
                  }
              })
    return (
      <div>
        <IconMenu
          iconButtonElement={<IconButton onClick={(e) => e.stopPropagation()}><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
          {tagMenu}
        </IconMenu>
      </div>
    );
  }
}

TagMenu.propTypes = {
};


export default TagMenu

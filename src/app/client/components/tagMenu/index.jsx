import _ from 'lodash';
import React, {PropTypes} from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';


export default class TagMenu extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick ( obj ) {
    console.log(obj);
  }

  render() {
    return (
      <div>
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
          <MenuItem
            primaryText="Tags"
            insetChildren={true}
            rightIcon={<ArrowDropRight />}
            menuItems={
              _.map(this.props.tags, ( v ) =>(
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
                  onTouchTap={() => this.onClick({"t_id": v._id, t_name: v.name, m_id: this.props.email._id})}
                  />
              ))
            }
            />
        </IconMenu>
      </div>
    );
  }
}

TagMenu.propTypes = {
};

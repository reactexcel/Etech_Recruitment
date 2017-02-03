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
    this.state={
      currentAction:''
    }
    this.onClick = this.onClick.bind(this);
    this.scheduleCandidate=this.scheduleCandidate.bind(this)
  }

  onClick ( obj ) {
    this.props.AssignTag([obj.m_id], obj.t_id)
  }
  scheduleCandidate(data,scheduleTagId){
    if(_.includes(data.tags,scheduleTagId)==false){
            this.props.onSchedule([data._id],scheduleTagId).then(()=>{
              this.setState({
                SnackbarOpen:true,
                SnackbarMessage:"Candidate assign to scheduled tag",
              })
            }).catch( (error) => {
              this.setState({
                SnackbarOpen:true,
                SnackbarMessage:error.toString(),
              })
            })

      }else{
        this.setState({
          "SnackbarOpen":true,
          "SnackbarMessage":"Candidates is already scheduled"
        })
      }
  }

  render() {
    let tagMenu=[];
    let tag_with_color = [];
    let dynamicActions = this.props.dynamicActions;
     _.map(this.props.tags, ( v ) =>{
      if(v.automatic == true){
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
                  onTouchTap={() => {
                      this.onClick({"t_id": v._id, m_id: this.props.email._id})
                  }}
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
                    onTouchTap={() => {
                        this.onClick({"t_id": v._id, m_id: this.props.email._id})
                    }}

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
                        onTouchTap={() => {this.scheduleCandidate(this.props.email,v._id)}}
                      />:<div></div>):<div></div>)
                  }else if(v.automatic==false){
                    tag_with_color.push({"tagId":v._id,"color":v.color})
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

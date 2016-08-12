import React, {PropTypes} from 'react';
import {addLogs} from '../../actions/logs'
import * as actions from '../../actions/tags'
import InboxTag from '../../components/inboxTag'
import {withRouter} from 'react-router'
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

class InboxTagContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggle;
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle () {
    this.toggle.handleOpen();
  }
  render() {
    return (
      <div className="col-sm-8 col-sm-offset-2">
        <InboxTag {...this.props} toggle={(toggle) => this.toggle = toggle}></InboxTag>
        <RaisedButton onClick={this.handleToggle} />
      </div>);
  }
}

InboxTagContainer.propTypes = {
  logging: React.PropTypes.func.isRequired,
  onAddTag: React.PropTypes.func.isRequired,
  onFetchTag: React.PropTypes.func.isRequired,
  onEditTag: React.PropTypes.func.isRequired,
  onRemoveTag: React.PropTypes.func.isRequired,
  tags: React.PropTypes.any.isRequired,
};


const mapStateToProps = (state) =>{
  state = state.toJS();
  return {
    tags : state.entities.inboxTag
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      logging: (action, id , detail) =>{
        dispatch(addLogs(action, id , detail));
      },
      onFetchTag: () =>{
        dispatch(actions.onFetchTag());
      },
      onAddTag: (title, color) =>{
        dispatch(actions.onAddTag(title, color));
      },
      onEditTag: (title, _id, color) =>{
        console.log(title, _id, color);
        dispatch(actions.onEditTag(title, _id ,color));
      },
      onRemoveTag: ( _id ) => {
        dispatch(actions.onRemoveTag(_id));
      },
    }
}

export default withRouter(connect(
 mapStateToProps,
 mapDispatchToProps
)(InboxTagContainer));





















/*
<RaisedButton label="Add tags" onTouchTap={this.handleToggle} />

*/

import React, {PropTypes} from 'react';
import {addLogs} from '../../../actions/logs'
import * as actions from '../../../actions/tags'
import InboxTagList from '../../../components/inboxTag/inboxTagList'
import {withRouter} from 'react-router'
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import InboxTag from '../../../components/inboxTag'

class InboxTagContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggle;
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentWillMount(){
      if (!Meteor.userId()) {
        this.props.router.push('/login');
      }
  }
  handleToggle () {
    this.toggle.handleOpen();
  }
  render() {
    return (
      <div className="col-sm-12">
          <InboxTagList {...this.props}/>
          <InboxTag onAddTag={this.props.onAddTag} toggle={(toggle) => this.toggle = toggle}></InboxTag>
          <div>
            <FloatingActionButton
               className="pull-right"
               zDepth={3}
               mini={true}
                onTouchTap={this.handleToggle}
               style={{position: "fixed", top: "90%", left: "94%"}}>
              <ContentAdd />
            </FloatingActionButton>
          </div>
      </div>);
  }
}

InboxTagContainer.propTypes = {
  logging: React.PropTypes.func.isRequired,
  onFetchTag: React.PropTypes.func.isRequired,
  onEditTag: React.PropTypes.func.isRequired,
  onAddTag: React.PropTypes.func.isRequired,
  onRemoveTag: React.PropTypes.func.isRequired,
  tags: React.PropTypes.any.isRequired,
};


const mapStateToProps = (state) =>{
  state = state.toJS();
  return {
    tags : state.entities.inboxTag,
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
      onEditTag: (title, _id, color) =>{
        dispatch(actions.onEditTag(title, _id ,color));
      },
      onRemoveTag: ( _id ) => {
        return dispatch(actions.onRemoveTag(_id));
      },
      onAddTag: (tag) =>{
        return dispatch(actions.onAddTag(tag));
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

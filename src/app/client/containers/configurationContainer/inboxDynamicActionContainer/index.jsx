import React, {PropTypes} from 'react';
import {withRouter} from 'react-router'
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DynamicActions from '../../../components/dynamicActions'
import {fetchTemplate} from '../../../actions/emailTemplates'
import {saveAction,fetchAction,deleteAction} from '../../../actions/dynamicActions'
import { onFetchTag} from '../../../actions/tags'
import CircularProgress from 'material-ui/CircularProgress';

const style = {
  container: {
    position: 'relative',
    textAlign:'center',
    paddingTop:'200px'
  },
  refresh: {
    verticalAlign:'middle',
    display: 'inline-block',
    position: 'relative',
  },
};
class InboxTagContainer extends React.Component {
	constructor(props) {
    super(props);
  }
  componentWillMount(){
      if (!Meteor.userId()) {
        this.props.router.push('/login');
      }
      this.props.onFetchTamplets()
      this.props.onFetchActions()
      this.props.onFetchTag()
  }
  render() {
    return(
        	<div>
              {(this.props.tags.length > 0 && this.props.dynamicActions.length >0)?<DynamicActions {...this.props} />:
              <div className="show" style={style.container}>
                    <CircularProgress size={1.5} />
              </div>}
        	</div>
        )
  }
}
function mapStateToProps( state ){
    state = state.toJS()
    return {
    	emailTemplates : state.entities.emailTemplates,
    	dynamicActions : state.entities.dynamicAction,
      tags : state.entities.inboxTag.sort(function(a, b){let x=a.name.localeCompare(b.name); if(x==1)return(1);if(x==-1)return(-1);return 0;}),
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    	onFetchTamplets:()=>{
            return dispatch(fetchTemplate())
      },
      onSaveAction:(id,action)=>{
            return dispatch(saveAction(id,action))
      },
      onFetchActions:()=>{
            return dispatch(fetchAction())
      },
      onDeleteAction:(id)=>{
            return dispatch(deleteAction(id))
      },
      onFetchTag : () => {
            return dispatch(onFetchTag());
      },
    }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)( InboxTagContainer ))
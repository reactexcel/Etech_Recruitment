import React, {PropTypes} from 'react';
import EmailSettingForm from '../emailSettingForm'
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

export default class EmailSettingFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "count": this.props.emailSetting.length
    }
  }

  componentWillMount(){
    this.props.onFetchSettings();
  }

  render() {
    let forms = this.state.count > 0?(_.map(this.props.saveSetting,( value )=>{
      return (<EmailSettingForm {...this.props} key={value._id}/>);
    })):<EmailSettingForm {...this.props} />;
    return (
      <div className="col-sm-12 col-md-12 ">
        {forms}
        <div className="pull-right"
          style={{"position": "absolute","top": "90%", "left":"92%"}}
        >
          <Paper zDepth={3} rounded={true} circle={true} style={{"backgroundColor": "#a94442"}}>
            <IconButton
              iconClassName="fa fa-plus fa-2x"
              iconStyle={{"color": "#eee"}}
            />
          </Paper>
        </div>
      </div>);
  }
}

EmailSettingFormContainer.propTypes = {
  onFetchSettings: PropTypes.func.isrequired,
  OnSaveSettings: PropTypes.func.isrequired,
  emailSetting: PropTypes.array.isrequired,
};

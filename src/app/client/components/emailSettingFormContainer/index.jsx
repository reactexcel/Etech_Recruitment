import React, {PropTypes} from 'react';
import EmailSettingForm from '../emailSettingForm'
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

export default class EmailSettingFormContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.props.onFetchSettings();
  }

  render() {
    let forms = this.props.emailSetting.length > 0?(_.map(this.props.emailSetting,( value )=>{
      return (<EmailSettingForm
          onSaveSettings={this.props.onSaveSettings}
          emailSetting = {value}
          key={value._id}/>);
    })):"";
    return (
      <div className="col-sm-12 col-md-12 ">
        {forms}
        <EmailSettingForm
          onSaveSettings={this.props.onSaveSettings}
          emailSetting = {[]}
        />
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
  onFetchSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

import React, {PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import SendEmailSettingForm from './sendEmailSettingForm'
import SendEmailSettingList from './sendEmailSettingList'
import Snackbar from 'material-ui/Snackbar'
import _ from 'lodash';
import LogoImg from '../../assets/images/logo.png'

export default class SendEmailSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "open": false,
      "message" : "",
    }
    this.selectedRow = this.selectedRow.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentWillMount(){
    this.props.onFetchSettings()
  }
  selectedRow(row, checked){
    if(checked)
      this.refs.form.update(row, "Save")
    else {
      this.refs.form.update([], "Save")
    }
  }
  clear(){
    this.refs.form.clear();
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 col-lg-12 col-md-12">
            <SendEmailSettingForm
              ref="form"
              onSaveSettings={this.props.onSaveSettings}
              emailSetting = {[]}
              onTestDetails = {this.props.onTestDetails}
              logging = {this.props.logging}
              />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-lg-12 col-md-12">
            <SendEmailSettingList selectedRow={this.selectedRow} {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

SendEmailSetting.propTypes = {
  onFetchSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onTestDetails: PropTypes.func.isRequired,
  logging: React.PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

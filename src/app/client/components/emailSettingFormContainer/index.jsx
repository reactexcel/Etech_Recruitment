import React, {PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import EmailSettingForm from '../emailSettingForm'
import EmailSettingList from '../emailSettingList'
import Snackbar from 'material-ui/Snackbar'
import _ from 'lodash';
import LogoImg from '../../assets/images/logo.png'

export default class EmailSettingFormContainer extends React.Component {
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
    this.props.onFetchSettings();
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
            <EmailSettingForm
              ref="form"
              onSaveSettings={this.props.onSaveSettings}
              emailSetting = {[]}
              logging = {this.props.logging}
              onTestDetails={this.props.onTestDetails}
              testDetails={this.props.testDetails}
              uiLoading={this.props.uiLoading}
              />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-lg-12 col-md-12">
            <EmailSettingList
              onActiveIMAPEmail={this.props.onActiveIMAPEmail}
              emailSetting={this.props.emailSetting}
              selectedRow={this.selectedRow}
              onTestDetails={this.props.onTestDetails}
              onRemoveDetails={this.props.onRemoveDetails}
              clear={this.clear}
              uiLoading={this.props.uiLoading}
              onStartCron={this.props.onStartCron}
              />
          </div>
        </div>
      </div>
    );
  }
}

EmailSettingFormContainer.propTypes = {
  onFetchSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onTestDetails: PropTypes.func.isRequired,
  onRemoveDetails: PropTypes.func.isRequired,
  logging: React.PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
  onActiveIMAPEmail: PropTypes.any.isRequired,
};

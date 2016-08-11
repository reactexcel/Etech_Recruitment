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

  snackbarClose(){
    this.setState({
      "open": false,
      "message" : "",
    });
  }

  snackbarOpen(message){
    this.setState({
      "open": true,
      "message" : message,
    });
  }

  selectedRow(row, checked){
    if(checked)
      this.refs.form.update(row, "Edit")
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
              />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-lg-12 col-md-12">
            <EmailSettingList
              emailSetting={this.props.emailSetting}
              selectedRow={this.selectedRow}
              onTestDetails={this.props.onTestDetails}
              clear={this.clear}
              />
          </div>
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.sanckbarClose}
        />
      </div>
    );
  }
}

EmailSettingFormContainer.propTypes = {
  onFetchSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  onTestDetails: PropTypes.func.isRequired,
  logging: React.PropTypes.func.isRequired,
  emailSetting: PropTypes.any.isRequired,
};

import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
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
    this.snackbarClose = this.snackbarClose.bind(this);
    this.snackbarOpen = this.snackbarOpen.bind(this);
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
      this.refs.form.update(row)
    else {
      this.refs.form.update([])
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12 col-lg-12 col-md-12">
          <AppBar
            title="Email server Settings"
            showMenuIconButton={false}
            conElementRight={<img src={LogoImg} />}
          />
          <div className="col-sm-8">
            <EmailSettingList
              emailSetting={this.props.emailSetting}
              selectedRow={this.selectedRow}
              />
          </div>
          <div className="col-sm-4 col-md-4 ">
            <EmailSettingForm
              ref="form"
              onSaveSettings={this.props.onSaveSettings}
              emailSetting = {[]}
              snackbarOpen={this.snackbarOpen}
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
  emailSetting: PropTypes.any.isRequired,
};

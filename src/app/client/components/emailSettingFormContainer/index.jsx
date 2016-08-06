import React, {PropTypes} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import EmailSettingForm from '../emailSettingForm'
import EmailSettingList from '../emailSettingList'
import _ from 'lodash';

export default class EmailSettingFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.selectedRow = this.selectedRow.bind(this);
  }

  componentWillMount(){
    this.props.onFetchSettings();
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
  emailSetting: PropTypes.any.isRequired,
};

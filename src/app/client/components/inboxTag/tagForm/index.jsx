import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
const classNames = require('classnames');

const style={
  "formInput":{
    // "marginLeft": "5%",
    // "marginRight": "5%",
    // "width": "50%"
  },
  "formButton":{
    position:"absolute",
    top: "87%",
    left: "77%"
  },
  "block": {
    maxWidth: 250,
  },
  "toggle": {
    marginBottom: 10,
    marginTop: 10,
  },
  "lable":{
    fontWeight:'normal',
    fontSize:15
  },
}

export default class TagForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
      color: this.props.color,
      type: "automatic",
      showReportToggle:this.props.toggle,
      errEmail:"",
      errSubject:"",
    }
    this.error=[];
    this.add = this.add.bind(this);
  }
  handleReport() {
        this.setState({showReportToggle: !this.state.showReportToggle});
  }

  add ( ) {
    if(this.state.tagName.length > 0 && this.state.type == "manual"){
      this.props.handleToggle();
      return this.props.onAddTag({
        name: this.state.tagName,
        color: this.props.color(),
        automatic: false
      });
   }else if(this.state.tagName.length > 0 && this.state.type == "automatic"){
     this.props.handleToggle();
      return this.props.onAddTag({
        name: this.state.tagName,
        color: this.props.color(),
        from: this.state.from,
        to: this.state.to,
        email: this.state.email,
        subject: this.state.subject,
        automatic: true,
        showOnReport:this.state.showReportToggle
      });
    }else{
      this.error.tagName = "Enter tag title";
      this.setState({"tagName": ""});
      return new Promise(function(resolve, reject) {
        reject("please fill the 'TAG TITLE' field properly");
      });
    }
  }

  render() {
    return (
      <div className="col-xs-12">
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={style.formInput}>
            <TextField
              type="text"
              floatingLabelText="Tag Title"
              hintText="Enter Tag Title "
              fullWidth={true}
              onChange={
                (evt) =>{
                  this.setState({"tagName": evt.target.value});
                  if (!evt.target.value.length > 0 ) {
                    this.error.tagName = "Enter tag title";
                  }else if (!/^[a-zA-Z0-9a!@#$%^&*. ?><|":';'"]+$/.test(evt.target.value)) {
                    this.error.tagName = "Invalid tag title";
                  }else{
                    this.error.tagName = "";
                  }
                }
              }
              errorText={this.error.tagName}
              value={this.state.tagName}
            />
          </div>
          <div style={style.formInput}>
            <RadioButtonGroup name="encrypt" labelPosition="right"
              defaultSelected={'automatic'}
              style={{maxWidth: 250}}
                onChange={
                  (evt, value) =>{
                    this.setState({"type": value});
                    this.props.callToSetState(value);
                    if ( typeof value == "undefined" ) {
                      this.error.type = "encrypt is required";
                    }else{
                      this.error.type = "";
                    }
                  }
                }>
              <RadioButton labelStyle={{fontWeight:"normal"}}
                value="manual"
                label="Manual Tag"
                />
              <RadioButton labelStyle={{fontWeight:"normal"}}
                value="automatic"
                label="Automatic Tag"
                />
            </RadioButtonGroup>
          </div>
          <div className={classNames({"hidden": this.state.type != "automatic"})}>
            <div style={style.formInput}>
              <TextField
                type="text"
                floatingLabelText="Match Email ID"
                hintText="Enter email id"
                fullWidth={true}
                onChange={
                  (evt) =>{
                    this.setState({"email": evt.target.value});
                  }
                }
                onBlur={
                  (evt) =>{
                    if (!evt.target.value.length > 0 ) {
                      this.setState({
                        errEmail:"Enter tag email",
                      });
                    }else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(evt.target.value)) {
                      this.setState({
                        errEmail:"Invalid email",
                      });
                    }else{
                      this.setState({
                        errEmail:"",
                      });
                    }
                  }
                }
                errorText={this.state.errEmail}
                value={this.state.email}
                />
            </div>
            <div style={style.formInput}>
              <TextField
                type="text"
                floatingLabelText="Match Subject"
                hintText="Enter Subject "
                fullWidth={true}
                onChange={
                  (evt) =>{
                    this.setState({"subject": evt.target.value});
                  }
                }
                onBlur={
                  (evt) =>{
                    if (!evt.target.value.length > 0 ) {
                      this.setState({
                        errSubject:"Enter Subject",
                      });
                    }else if (/^[a-zA-Z0-9 !@#$%^&*()_+=-`~}:"|<>?';,. ]$/.test(evt.target.value)) {
                      this.setState({
                        errSubject:"Invalid subject",
                      });
                    }else{
                      this.setState({
                        errSubject:"",
                      });
                    }
                  }
                }
                errorText={this.state.errSubject}
                value={this.state.subject}
                />
            </div>
            <div style={style.formInput}>
              <DatePicker
                floatingLabelText="From"
                onChange={
                  (evt, value) =>{
                    this.setState({"from": moment(value).format("YYYY/MM/DD")});
                  }
                }
              />
              <DatePicker
                floatingLabelText="To"
                onChange={
                  (evt, value) =>{
                    this.setState({"to": moment(value).format("YYYY/MM/DD")});
                  }
                }
              />
            </div>
            <div style={style.formInput}>
              <div style={style.block}>
                    <Toggle
                      label="Show on Report"
                      labelStyle={style.lable}
                      defaultToggled={this.state.showReportToggle}
                      style={style.toggle}
                      onToggle={this.handleReport.bind(this)}
                      toggle={this.state.showReportToggle}
                    />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

TagForm.propTypes = {
  color: PropTypes.func.isRequired,
  onAddTag: PropTypes.func.isRequired,
};

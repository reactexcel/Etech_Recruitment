import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DatePicker from 'material-ui/DatePicker';
const classNames = require('classnames');

const style={
  "formInput":{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "50%"
  },
  "formButton":{
    position:"absolute",
    top: "85%",
    left: "77%"
  }
}

export default class TagForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
      color: this.props.color,
      type: "manual",
    }
    this.error=[];
    this.add = this.add.bind(this);
  }

  add ( ) {
    if(this.state.tagName.length > 0 && this.state.type == "manual"){
      this.props.onAddTag({
        name: this.state.tagName,
        color: this.props.color(),
        automatic: false
      });
      this.props.handleToggle();
   }else if(this.state.tagName.length > 0 && this.state.type == "automatic"){
      this.props.onAddTag({
        name: this.state.tagName,
        color: this.props.color(),
        from: this.state.from,
        to: this.state.to,
        email: this.state.email,
        automatic: true
      });
      this.props.handleToggle();
    }else{
      this.error.tagName = "Enter tag title";
      this.setState({"tagName": ""});
    }
  }

  render() {
    return (
      <div>
        <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group" style={style.formInput}>
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
          <div className="form-group" style={style.formInput}>
            <RadioButtonGroup name="encrypt" labelPosition="right"
              style={{maxWidth: 250}}
                onChange={
                  (evt, value) =>{
                    this.setState({"type": value});
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
            <div className="form-group" style={style.formInput}>
              <TextField
                type="text"
                floatingLabelText="Filter Email"
                hintText="Enter email "
                fullWidth={true}
                onChange={
                  (evt) =>{
                    this.setState({"email": evt.target.value});
                    if (!evt.target.value.length > 0 ) {
                      this.error.email = "Enter tag email";
                    }else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(evt.target.value)) {
                      this.error.email = "Invalid email";
                    }else{
                      this.error.email = "";
                    }
                  }
                }
                errorText={this.error.email}
                value={this.state.email}
                />
            </div>
            <div className="form-group" style={style.formInput}>
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
          </div>
          <div className="form-group" style={style.formButton}>
            <RaisedButton
              label="Add Title"
              primary={true}
              onClick={this.add}
            />
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

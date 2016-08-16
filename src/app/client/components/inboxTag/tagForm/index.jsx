import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style={
  "formInput":{
    "marginLeft": "5%",
    "marginRight": "5%",
    "width": "50%"
  },
  "formButton":{
    "marginTop": "5%",
  }
}

export default class TagForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tagName: "",
      color: this.props.color,
    }
    this.error=[];
    this.add = this.add.bind(this);
  }

  add ( ) {
    if(this.state.tagName.length > 0){
     this.props.onAddTag(this.state.tagName, this.props.color());
     this.props.handleToggle();
    }else{
      this.error.tagName = "Enter tag title";
      this.setState({"tagName": ""});
    }
  }

  render() {
    return (
      <div>
        <form className="form-inline">
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
                  }else if (!/^[a-zA-Z0-9a!@#$%^&* ]+$/.test(evt.target.value)) {
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

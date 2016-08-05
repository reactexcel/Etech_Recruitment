import React, {PropTypes} from 'react';
import EmailSettingForm from '../emailSettingForm'
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

export default class EmailSettingFormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      "count": 2
    }
  }

  render() {
    let forms = _.times(this.state.count,( i )=>{
      return (<EmailSettingForm {...this.props} key={i}/>);
    });
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
  "emailId": PropTypes.string,
  "password": PropTypes.string,
  "server": PropTypes.string,
  "port": PropTypes.number,
  "encrpyt": PropTypes.string,
//  "onEmailSettingSave": PropTypes.func.isrequired
};

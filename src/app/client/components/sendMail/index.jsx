import React, {PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'

export default class SendMail extends React.Component {
  constructor(props) {
    super(props);
    this.send = this.send.bind(this);
  }

  send(){
    let email ={
      to: "example.example.com",
      from: "example@example.com",
      subject: "testing mail",
      text: " Test email send to you"
    }
    //call send mail method from server
    Meteor.call("sendMail", email, (err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <button className="btn btn-Primary" onClick={this.send}>SendMail</button>
      </div>
    );
  }
}

SendMail.propTypes = {

};

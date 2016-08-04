import Immutable from 'immutable';

let initialstate = Immutable.Map({
                    "TO": "",
                    "From": "",
                    "Subject": "",
                    "Message": ""
                });

export function sendMail(state=initialstate, actions) {
  return state;
}

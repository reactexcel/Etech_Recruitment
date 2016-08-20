import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { withRouter, router } from 'react-router'

import List from 'material-ui/List'

import TextField from 'material-ui/TextField';

import {Menu, MenuItem} from 'material-ui/Menu'
import FlatButton from 'material-ui/FlatButton'
import Avatar from 'material-ui/Avatar';
import _ from 'lodash'
import verge from 'verge';

class SendEmail extends React.Component {
    constructor( props ){
        super( props );
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
    }
   
    render(){
    
        let count_unread_emails = ""
        if( typeof this.props.inbox.count_unread_emails != 'undefined' && this.props.inbox.count_unread_emails > 0 ){
            count_unread_emails  = "(" + this.props.inbox.count_unread_emails + ")"
        }
        return(
            <div className="row" style={{ "margin":"0px", "position" : "relative"}}>
                <div className="col-xs-2" style={{ "padding":"0px", "backgroundColor":"#fff", "height":verge.viewportH()+200+"px", "position":"absolute",}}>

                    <Menu>
                        <MenuItem  primaryText={
                            <Link to="sendmail" style={{"padding":"0px 0px"}}>Send mail</Link>
                        }/>
                        <MenuItem  primaryText={
                            <Link to="/inbox" style={{"padding":"0px 0px"}}>Inbox {count_unread_emails}</Link>
                        }/>
                        <div >
                        {_.map(this.props.tags, (t) => (
                            <MenuItem
                            key={t._id}
                            primaryText={
                                <FlatButton
                                  icon={
                                    <Avatar
                                      backgroundColor={t.color}
                                      style={{color:"#fff"}}
                                      size={20}
                                      children={
                                        _.upperCase(t.name[0])
                                      }></Avatar>
                                  }
                                  label={t.name}
                                  ></FlatButton>
                            }
                            onTouchTap={() => this.onClick({"t_id": t._id})}
                           />

                        ))}
                      </div>
                    </Menu>
                    <hr/>
                </div>
                <div className="col-xs-10" style={{ "float":"right"}}>
                    <div className="row" style={{margin:'40px 4px 0px'}}>
                    <div className="col-xs-12">
            <div className='row' style={{background: '#fff'}}>
                <div className="col-xs-12" style={{background: 'antiquewhite',padding: '10px',borderBottom: '1px solid gainsboro'}}>
                    <div className="col-xs-12">
                       <b><i>Send new mail</i></b> <br /> 
                    </div>
                </div>
                <div className="col-xs-12" style={{fontSize: '20px',padding: "10px 20px 20px",borderBottom: '1px solid gainsboro'}}>
                    <TextField
                    floatingLabelText="To"
                    fullWidth='true'
                    />
                </div>
                <div className="col-xs-12" style={{marginBottom: '15px',borderBottom: '1px solid gainsboro'}}>
                  
                </div>

            </div>
        </div>
        </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SendEmail)

import React, {PropTypes} from 'react';
import { withRouter, Link } from 'react-router';
import ReactHtmlParser from 'react-html-parser';

class EmailBody extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        data:'',
        attachmentlink:'',
        bodysec:'col-xs-12',
        attchsec:'hidden',
    }
  }
componentWillReceiveProps(props){
 console.log(props.email)
     let id = props.params.id
    let data;
    _.map(props.email,(email)=>{
    console.log(email)
        if(email._id == id){
            this.setState({
                data:email,
            })
            if(typeof email.attachments != 'undefined'){
                this.setState({
                    attachmentlink:email.attachments[0].link,
                    bodysec:'col-xs-6',
                    attchsec:'col-xs-6',
                })
            }
        }
    })
}

render(){
  	   let data = this.state.data;
	return(
		 <div className="row" style={{marginTop:'50px'}}>
                    <div className="col-xs-12">
                        <div className="col-xs-2" >
                            <div className="list-group">
                                <button type="button" className="list-group-item" style={{ 'borderRadius':'0px'}}><Link to="/inbox">Inbox</Link></button>
                            </div>
                        </div>
                        <div className="col-xs-10 " >
                        <div className='row' style={{background:'#fff'}}>

                            <div className="col-xs-12" style={{background:'antiquewhite',padding:'10px',borderBottom:'1px solid gainsboro'}}>
                            		<div className="col-xs-6">
                            		From : <b>{data.from}</b> <br />
                            		Sender email : <b>{data['sender-mail']} </b>
                            		</div>
                            		<div className="col-xs-6" style={{textAlign:"right"}} dangerouslySetInnerHTML={{__html: data.email_date }}>
                            		</div>
                            </div>
                            <div className="col-xs-12" style={{fontSize:'20px',padding:"10px 20px 20px",borderBottom:'1px solid gainsboro'}}>
                            	{data.subject}
                            </div>
                          	<div className="col-xs-12" style={{marginBottom:'15px',borderBottom:'1px solid gainsboro'}}>
                                <div className="row">
                                <div className={this.state.bodysec} dangerouslySetInnerHTML={{__html:data.body }} >	
                                
                                </div>
                                <div className={this.state.attchsec} style={{height:'100vh'}}>
                                <iframe src={this.state.attachmentlink} 
                            		style={{height:'100%',width:'100%',border:'none'}}
                                	scrolling="no"
            						></iframe>
                                </div>
                                </div>
                            </div>
                            
                        </div>
                        </div>
                    </div>
                </div>
		)
}
}



export default EmailBody
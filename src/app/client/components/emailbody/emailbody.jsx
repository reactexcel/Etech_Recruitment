import React, {PropTypes} from 'react';
import { withRouter, Link } from 'react-router';
import ReactHtmlParser from 'react-html-parser';

class EmailBody extends React.Component {
  constructor(props) {
    super(props);
  }
    componentWillReceiveProps(props){

}

render(){
  	   let data;
    _.map(this.props.list, (email)=>{
      if(email._id==this.props.params.id){
      		data=email
      }
    })
let attachmentlink;
if(typeof data.attachments != 'undefined'){
	attachmentlink=data.attachments[0].link
}
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
                                <div className="col-xs-6" dangerouslySetInnerHTML={{__html:data.body }} >	
                                
                                </div>
                                <div className="col-xs-6" style={{height:'100vh'}}>
                                <iframe src={attachmentlink} 
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
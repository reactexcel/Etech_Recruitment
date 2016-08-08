import React from 'react'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack, greenA700, red200} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);




class EmailListItem extends React.Component {

    constructor( props ){
        super( props );
    }
    render(){
    	let m_from = this.props.email.from
    	let m_source_email_id = this.props.email.m_source_email_id
		let f_char = m_from.charAt(0)
      	f_char = f_char.toUpperCase();

      	let avatar = <Avatar backgroundColor={red200} color={darkBlack} >{f_char}</Avatar>

    	if( typeof this.props.email.m_read_status != 'undefined' && this.props.email.m_read_status == 1 ){
    		
        avatar = <Avatar backgroundColor={greenA700} color={darkBlack} >{f_char}</Avatar>
    	}
    	
    	let rightIconMenu = (
  			<IconMenu iconButtonElement={iconButtonElement}>
  				<MenuItem >ARUn</MenuItem>
  				<MenuItem >ARUn</MenuItem>
  				<MenuItem >ARUn</MenuItem>
  			</IconMenu>
		);


    	
       	return(
       		<div key={this.props.email._id} >
       			<ListItem
			        leftAvatar={ avatar }
			        rightIconButton={rightIconMenu}
			        primaryText={this.props.email.subject}
			        secondaryText={''}
			        secondaryText={ <p> <span style={{color: darkBlack}}>From : { m_from }</span></p> }
          			
			    />
				<Divider inset={true} />
	        </div>
       		
        );
    }
}

export default EmailListItem
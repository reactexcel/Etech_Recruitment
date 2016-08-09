import React, {PropTypes} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}from 'material-ui/Table';
import _ from 'lodash';
const classNames = require('classnames');

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

export default class Login extends React.Component{
	static contextTypes={
			muiTheme:React.PropTypes.object.isRequired
    }
    constructor(props){
		super(props);
	}
	componentWillMount(){
    }
    componentWillReceiveProps( props ){
    }
	render(){
		let logs=this.props.log.logs
		let logList=logs.map((log)=>{
			return(
				<TableRow>
                <TableRowColumn>{log.user_id}</TableRowColumn>
                <TableRowColumn>{log.action_type}</TableRowColumn>
                <TableRowColumn>{log.details}</TableRowColumn>
                <TableRowColumn>{log.created_on}</TableRowColumn>
                </TableRow>
				);
		})
		let prev_page_num = this.props.log.previous_page
        let next_page_num = this.props.log.next_page

        let prev_page_link = <li style={{cursor:'pointer'}} onClick={ () => this.props.pageChange(prev_page_num)}><span aria-hidden="true">&laquo;</span></li>
        if( prev_page_num == '' ){
            prev_page_link = <li style={{cursor:'pointer'}} className="disabled" onClick={ () => this.props.pageChange(prev_page_num)} ><span aria-hidden="true">&laquo;</span></li>
        }

        let next_page_link = <li style={{cursor:'pointer'}} onClick={ () => this.props.pageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        if( next_page_link == '' ){
            next_page_link = <li style={{cursor:'pointer'}} className="disabled" onClick={ () => this.props.pageChange(next_page_num)} ><span aria-hidden="true">&raquo;</span></li>
        }
		return(
		<div>
              <Table
              fixedHeader={true}
              fixedFooter={true}
              >
    <TableHeader
    adjustForCheckbox={false}
    displaySelectAll={false}
    >
    <TableRow>
        <TableHeaderColumn colSpan="4"  style={{textAlign: 'center'}}>
           <h4>Candidate Logs</h4>
        </TableHeaderColumn>
    </TableRow>
      <TableRow>
        <TableHeaderColumn>User Id</TableHeaderColumn>
        <TableHeaderColumn>Action</TableHeaderColumn>
        <TableHeaderColumn>Details</TableHeaderColumn>
        <TableHeaderColumn>Date</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
      {logList}
    </TableBody>
  </Table>
  <div style={{textAlign:'center'}}>
   <ul className="pagination">
   {prev_page_link}
   {next_page_link}
   </ul>
   </div>
  </div>
			);
	}
}

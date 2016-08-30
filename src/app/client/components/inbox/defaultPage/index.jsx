import React, {PropTypes} from 'react';
import _ from 'lodash';

export default class DefaultPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    let bolt = [];
    let left = 35;
    _.times(3 , (i) => {
      left += 5;
      bolt.push(<span key={i}
         style={
          {
            color:"#999",
            position:"relative",
            top: '-10%',
            left: left+'%',
            fontSize:'35'
          }
        }
        >
        <i className="fa fa-bolt" aria-hidden="true"></i>
      </span>)
    })
    return (
      <div
        className=" col-sm-12 col-xs-12"
        style={
          {
            color:"lightgray",
            height: '90vh',}}
      >
      <div style={
        { width: '50%',
          height: '80%',
          border: '1px solid gray',
          borderRadius: '50% 50% 50% 50%',
          backgroundColor: this.props.color,
          marginLeft: '25%',
          marginTop: '5%'
        }
      }>
      <div style={{marginTop: "10%",width: '100%',}}>
        <div style={{ fontSize:'40',textAlign: 'center'}}>
          <i className="fa fa-cloud fa-5x" aria-hidden="true"></i>
        </div>
        <div style={{marginTop: '-3.5%'}}>
          {bolt}
        </div>
      </div>
      <div style={{ fontSize:'20',textAlign: 'center',marginTop: "8%"}}>
        There is no Email in Tag: <u>{_.upperFirst(this.props.name)} </u>
      </div>
      </div>
    </div>);
  }
}

DefaultPage.propTypes = {
};

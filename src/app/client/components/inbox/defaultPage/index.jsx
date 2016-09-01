import React, {PropTypes} from 'react';
import _ from 'lodash';

export default class DefaultPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
   // console.log(this.props);
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
            marginTop:'-60px',
            color:"lightgray",
            height: '100vh',
            backgroundColor:'#DCDCDC'
          }}
      >
      <div style={
        { width: '50%',
          height: '80%',
          color:'#808080',
          //border: '1px solid gray',
          borderRadius: '50% 50% 50% 50%',
         // backgroundColor: this.props.color,
          marginLeft: '25%',
          marginTop: '5%'
        }
      }>
      <div style={{marginTop: "10%",width: '100%',}}>
        <div style={{ fontSize:'40',textAlign: 'center'}}>
          <i className="fa fa-ban fa-5x" aria-hidden="true"></i>
        </div>
      </div>
      <div style={{ fontSize:'20',textAlign: 'center',marginTop: "8%"}}>
        No Candidates Found
      </div>
      </div>
    </div>);
  }
}

DefaultPage.propTypes = {
};

import React from 'react';
import ReactQuill from 'react-quill';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	text : props.data
    };
     this.onTextChange = this.onTextChange.bind( this )
  }
  
    componentWillReceiveProps( props ){
    	this.setState({text:props.data})
    }
  onTextChange(value) {
    this.setState({ text:value });
    this.props.content(this.state.text)
    
  }
  render() {
    let  editorStyle = {
        overflow: 'auto',
        width: '100%',
        height: 200,
        maxHeight: 400
    }
    return(
    	<ReactQuill  theme="snow"
                  value={this.state.text}
                  onChange={this.onTextChange} 
                  items={ReactQuill.Toolbar.defaultItems}
                  style={editorStyle}
                  />
                 
    
    )
  }
}

export default MyEditor


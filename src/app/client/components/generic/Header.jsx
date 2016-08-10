import React, {PropTypes} from 'react'
import AppBar from 'material-ui/AppBar';

class Header extends React.Component {
    constructor( props ){
        super( props );
    }
    componentDidMount(){
    }
    componentWillReceiveProps( props ){
    }
    render(){
        return(
            <AppBar title={this.props.title} iconClassNameRight="muidocs-icon-navigation-expand-more" />
        )
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired
};

export default Header


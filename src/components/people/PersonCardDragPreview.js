import React, { Component } from 'react';
import {connect} from 'react-redux';
import {personSelector} from '../../ducks/people';

class PersonCardDragPreview extends Component {
    render() {

        return (
            <div>
                {this.props.people.firstName}
            </div>
        );
    }
}

export default connect((state, props) => ({
    people: personSelector(state, props)
}))(PersonCardDragPreview);

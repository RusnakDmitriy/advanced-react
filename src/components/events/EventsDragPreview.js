import React, { Component } from 'react';
import {connect} from 'react-redux';
import {eventSelector} from '../../ducks/events';

class EventsDragPreview extends Component {
    render() {
        return (
            <div>
                {this.props.event.title}
            </div>
        );
    }
}

export default connect((state, props) => ({
    event: eventSelector(state, props)
}))(EventsDragPreview);

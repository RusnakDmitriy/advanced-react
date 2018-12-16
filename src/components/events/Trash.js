import React, { Component } from 'react';
import {DropTarget} from 'react-dnd';
import {connect} from 'react-redux';
import {Motion, spring, presets} from 'react-motion';
import {deleteEventFromList} from '../../ducks/events';

class Trash extends Component {

    render() {
        const {connectDropTarget, hovered, canDrop} = this.props;
        const trashStyle={
            position: 'absolute',
            top: 0,
            right: 0,
            height: '150px',
            width: '140px',
            border: '1px solid black',
            backgroundColor: hovered ? 'green' : 'white'
        };

        return <Motion
            defaultStyle={{opacity: 0}}
            style={{opacity: spring(1, {...presets.noWobble, stiffness: presets.noWobble.stiffness/20})}}
        >
            {interpolatedStyle => connectDropTarget(
                <div style={{...trashStyle, ...interpolatedStyle}}>
                    TRASH
                </div>
            )}
        </Motion>
    }
}

const spec = {
    drop(props, monitor) {
        const eventUid = monitor.getItem().uid;
        props.deleteEventFromList(eventUid);
        console.log('---', 'event', eventUid)

        return { eventUid }
    }
}

const collect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    hovered: monitor.isOver()
})

export default connect(null, {deleteEventFromList})(DropTarget(['events'], spec, collect)(Trash))

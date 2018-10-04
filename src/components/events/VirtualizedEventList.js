import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Table, Column} from 'react-virtualized';
import {moduleName, fetchAll, eventListSelector, selectEvent} from '../../ducks/events';
import Loader from '../common/Loader';
import 'react-virtualized/styles.css';

class EventList extends Component {
    componentDidMount(){
        this.props.fetchAll()
    }

    render() {
        const {loading, events} = this.props;
        if(loading) return <Loader />
        return (
            <Table
                rowCount={events.length}
                rowGetter={this.rowGetter}
                rowHeight={40}
                headerHeight={50}
                overscanRowCount={5}
                width={700}
                height={300}
                onRowClick={this.handleRowClick}
            >
                <Column
                    label="title"
                    dataKey="title"
                    width={300}
                />
                <Column
                    label="where"
                    dataKey="where"
                    width={250}
                />
                <Column
                    label="when"
                    dataKey="month"
                    width={150}
                />
            </Table>
        );
    }

    rowGetter = ({index}) => {
        return this.props.events[index];
    }

    handleRowClick = (rowData) => {
        const {selectEvent} = this.props;
        selectEvent && selectEvent(rowData.uid)
    }
}

export default connect(state => ({
    events: eventListSelector(state),
    loading: state[moduleName].loading
}), {fetchAll, selectEvent})(EventList)
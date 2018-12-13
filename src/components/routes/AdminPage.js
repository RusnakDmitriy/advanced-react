import React, { Component } from 'react';
import PeopleList from '../people/PeopleList';
import EventTable from '../events/VirtualizedEventList';
import SelectedEvents from '../events/SelectedEvents';
import Trash from '../events/Trash';

class AdminPage extends Component {

    render() {
        return (
            <div>
                <h1>Admin Page</h1>
                <PeopleList />
                <SelectedEvents />
                <EventTable />
                <Trash />
            </div>
        );
    }
}

export default AdminPage;

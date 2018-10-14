import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Table, Column} from 'react-virtualized';
import {moduleName, getPerson, peopleListSelector} from '../../ducks/people';
import Loader from '../common/Loader';
import 'react-virtualized/styles.css';

class PeopleTable extends Component {
    componentDidMount(){
        this.props.getPerson()
    }

    render() {
        const {loading, people} = this.props;
        if(loading) return <Loader />
        return (
            <Table
                rowCount={people.length}
                rowGetter={this.rowGetter}
                rowHeight={40}
                headerHeight={50}
                width={700}
                height={300}
                onRowClick={this.handleRowClick}
            >
                <Column
                    label="First Name"
                    dataKey="firstName"
                    width={250}
                />
                <Column
                    label="Last Name"
                    dataKey="lastName"
                    width={250}
                />
                <Column
                    label="email"
                    dataKey="email"
                    width={250}
                />
            </Table>
        );
    }

    rowGetter = ({index}) => {
        return this.props.people[index];
    }

    handleRowClick = (rowData) => {
        const {selectEvent} = this.props;
        selectEvent && selectEvent(rowData.uid)
    }
    // getRows() {
    //     return this.props.people.map(this.getRow)
    // }
    //
    // getRow = (people) => {
    //     return <tr key={people.uid}>
    //         <td>{people.firstName}</td>
    //         <td>{people.lastName}</td>
    //         <td>{people.email}</td>
    //     </tr>
    // }
}

export default connect(state => ({
    people: peopleListSelector(state),
    loading: state[moduleName].loading
}), {getPerson})(PeopleTable)
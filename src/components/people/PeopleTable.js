import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Table, Column} from 'react-virtualized';
import {TransitionMotion, spring} from 'react-motion';
import {moduleName, getPerson, peopleListSelector} from '../../ducks/people';
import Loader from '../common/Loader';
import 'react-virtualized/styles.css';

class PeopleTable extends Component {
    componentDidMount(){
        this.props.getPerson()
    }

    getStyles = () => {
        return this.props.people.map(person => ({
            style: {
                opacity: spring(1, {stiffness: 50})
            },
            key: person.uid,
            data: person
        }))
    }

    willEnter = () => ({
        opacity: 0
    })

    render() {
        const {loading, people} = this.props;

        return <TransitionMotion
            styles={this.getStyles}
            willLeave={this.willLeave}
            willEnter={this.willEnter}
        >
            {(interpolatedStyles) => <Table
                rowCount={interpolatedStyles.length}
                rowGetter={this.rowGetter}
                rowHeight={40}
                headerHeight={50}
                width={700}
                height={300}
                overscanRowCount={2}
                rowStyle={({ index }) => index < 0 ? {} : interpolatedStyles[index].style}
                ref={this.setListRef}
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
            </Table>}
        </TransitionMotion>

        // return (
        //     <Table
        //         rowCount={people.length}
        //         rowGetter={this.rowGetter}
        //         rowHeight={40}
        //         headerHeight={50}
        //         width={700}
        //         height={300}
        //         onRowClick={this.handleRowClick}
        //     >
        //         <Column
        //             label="First Name"
        //             dataKey="firstName"
        //             width={250}
        //         />
        //         <Column
        //             label="Last Name"
        //             dataKey="lastName"
        //             width={250}
        //         />
        //         <Column
        //             label="email"
        //             dataKey="email"
        //             width={250}
        //         />
        //     </Table>
        // );
    }

    rowGetter = ({index}) => {
        return this.props.people[index];
    }

    handleRowClick = (rowData) => {
        const {selectEvent} = this.props;
        selectEvent && selectEvent(rowData.uid)
    }

    setListRef = ref => this.table = ref

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
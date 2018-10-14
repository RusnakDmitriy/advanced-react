import React, { Component } from 'react';
import {connect} from 'react-redux';
import NewPersonForm from '../people/NewPersonForm';
import PeopleTable from '../people/PeopleTable';
import {addPerson, getPerson} from '../../ducks/people';

class PeoplePage extends Component {
    componentDidMount(){
        this.props.getPerson()
    }

    render() {
        const{addPerson} = this.props;
        return (
            <div>
                <h2>Add new person</h2>
                <NewPersonForm onSubmit={addPerson} />
                <PeopleTable />
            </div>
        );
    }
}

export default connect(null, {addPerson, getPerson})(PeoplePage);
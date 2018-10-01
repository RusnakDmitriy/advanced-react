import React, { Component } from 'react';
import {connect} from 'react-redux';
import NewPersonForm from '../people/NewPersonForm';
import {addPerson} from '../../ducks/people';

class PeoplePage extends Component {
    render() {
        const{addPerson} = this.props;
        return (
            <div>
                <h2>Add new person</h2>
                <NewPersonForm onSubmit={addPerson} />
            </div>
        );
    }
}

export default connect(null, {addPerson})(PeoplePage);
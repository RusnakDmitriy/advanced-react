import React, { Component } from 'react';
import {connect} from 'react-redux';
import NewPersonForm from '../people/NewPersonForm';
import PeopleTable from '../people/PeopleTable';
import {addPerson, getPerson, moduleName} from '../../ducks/people';
import Loader from '../common/Loader';

class PeoplePage extends Component {
    componentDidMount(){
        this.props.getPerson()
    }

    render() {
        const{addPerson, loading} = this.props;
        return (
            <div>
                <h2>Add new person</h2>
                <PeopleTable />
                {loading
                    ? <Loader />
                    : <NewPersonForm onSubmit={addPerson} />
                }
            </div>
        );
    }
}

export default connect(state => ({
    loading:state[moduleName].loading
}), {addPerson, getPerson})(PeoplePage);
import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';
import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import PeoplePage from './routes/PeoplePage';
import EventsPage from './routes/EventsPage';
import ProtectedRoute from './common/ProtectedRoute';
import {connect} from 'react-redux';
import {moduleName, signOut} from '../ducks/auth';

class Root extends Component {
    render() {
        const {signOut, signedIn} = this.props;
        const btn = signedIn
            ? <button onClick={signOut}>sign out</button>
            : <Link to="/auth/signin">sign in</Link>
        return (
            <div>
                {btn}
                <ProtectedRoute path="/admin" component={AdminPage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/people" component={PeoplePage} />
                <Route path="/events" component={EventsPage} />
            </div>
        );
    }
}

export default connect(state => ({
    signedIn: !!state[moduleName].user
}), {signOut})(Root);

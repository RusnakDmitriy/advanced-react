import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import validateEmail from 'email-validator';
import ErrorField from '../common/ErrorField';

class NewPersonForm extends Component{
    render(){
        const {handleSubmit} = this.props;
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <Field name="firstName" component={ErrorField} />
                    <Field name="lastName" component={ErrorField} />
                    <Field name="email" component={ErrorField} />
                    <div>
                        <input type="submit" />
                    </div>
                </form>
            </div>
        );
    }
}

function validate({firstName, email}) {
    const errors = {};
    if(!email) errors.email = 'email is required'
    else if(!validateEmail.validate(email)) errors.email = 'invalid email';

    if(!firstName) errors.firstName = 'first name is required';

    return errors
}

export default reduxForm({
    form: 'person',
    validate
})(NewPersonForm);

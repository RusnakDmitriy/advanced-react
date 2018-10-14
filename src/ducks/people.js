import {appName} from '../config';
import {Record, OrderedMap} from 'immutable';
import {put, takeEvery, take, call, all} from 'redux-saga/effects';
import {reset} from 'redux-form';
import {createSelector} from 'reselect';
import {generateId, fbDatatoEntities} from './utils';
import firebase from 'firebase';

const ReducerState = Record({
    entities: new OrderedMap({}),
    loading: false,
    loaded: false
});

const PersonRecord = Record({
    uid: null,
    firstName: null,
    lastName: null,
    email: null
});

export const moduleName = 'people';
export const ADD_PERSON_REQUEST = `${appName}/${moduleName}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${appName}/${moduleName}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${appName}/${moduleName}/ADD_PERSON_ERROR`;
export const GET_PERSON_REQUEST = `${appName}/${moduleName}/GET_PERSON_REQUEST`;
export const GET_PERSON_SUCCESS = `${appName}/${moduleName}/GET_PERSON_SUCCESS`;
export const GET_PERSON_ERROR = `${appName}/${moduleName}/GET_PERSON_ERROR`;

export default function reducer(state=new ReducerState(), action){
    const {type, payload} = action;
    switch(type){
        case ADD_PERSON_SUCCESS:
            return state
                .set('loading', false)
                .set('loaded', true)
                .setIn(['entities', payload.uid], new PersonRecord(payload));

        case GET_PERSON_REQUEST:
        case ADD_PERSON_REQUEST:
            return state.set('loading', true);

        case GET_PERSON_SUCCESS:
            return state
                .set('loading', false)
                .set('entities', fbDatatoEntities(payload, PersonRecord))
                .set('loaded', true);

        default:
            return state;
    }
}

export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(stateSelector, state => state.entities);
export const peopleListSelector = createSelector(entitiesSelector, entities => (
    entities.valueSeq().toArray()
));

export function addPerson(person) {
    return {
        type: ADD_PERSON_REQUEST,
        payload: person
    }
}

export function getPerson() {
    return {
        type: GET_PERSON_REQUEST
    }
}

export const addPersonSaga = function * (action) {
    const uid = yield call(generateId);

    try {
        const ref = firebase.database().ref('people');

        ref.push({
            ...action.payload,
            uid
        });

        yield put({
            type: ADD_PERSON_SUCCESS,
            payload: {...action.payload, uid}
        })

        yield put(reset('person'))
    } catch(error) {
        yield put({
            type: ADD_PERSON_ERROR,
            error
        })
    }
}

export const getPersonSaga = function * () {

    while(true) {
        const ref = firebase.database().ref('people');

        yield take(GET_PERSON_REQUEST);

        try {
            const data = yield call([ref, ref.once], 'value');

            yield put({
                type: GET_PERSON_SUCCESS,
                payload: data.val()
            })
        } catch (error) {
            yield put({
                type: GET_PERSON_ERROR,
                error
            })
        }
    }
}

// export function addPerson(person) {
//     return (dispatch) => {
//          dispatch({
//              type: ADD_PERSON,
//              payload: {
//                 person: {id: Date.now(), ...person}
//              }
//          })
//     }
// }

export const saga = function * () {
    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        getPersonSaga()
    ])
}
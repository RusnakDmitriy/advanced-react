import {appName} from '../config';
import {Record, OrderedMap} from 'immutable';
import {put, takeEvery, take, call, all, select} from 'redux-saga/effects';
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
    email: null,
    events: []
});

export const moduleName = 'people';
export const ADD_PERSON_REQUEST = `${appName}/${moduleName}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_SUCCESS = `${appName}/${moduleName}/ADD_PERSON_SUCCESS`;
export const ADD_PERSON_ERROR = `${appName}/${moduleName}/ADD_PERSON_ERROR`;
export const GET_PERSON_REQUEST = `${appName}/${moduleName}/GET_PERSON_REQUEST`;
export const GET_PERSON_SUCCESS = `${appName}/${moduleName}/GET_PERSON_SUCCESS`;
export const GET_PERSON_ERROR = `${appName}/${moduleName}/GET_PERSON_ERROR`;
export const ADD_EVENT_REQUEST = `${appName}/${moduleName}/ADD_EVENT_REQUEST`;
export const ADD_EVENT_SUCCESS = `${appName}/${moduleName}/ADD_EVENT_SUCCESS`;

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

        case ADD_EVENT_SUCCESS:
            return state.setIn(['entities', payload.personUid, 'events'], payload.events)

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

export function addEventToPerson(eventUid, personUid) {
    return {
        type: ADD_EVENT_REQUEST,
        payload: {eventUid, personUid}
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

export const addEventSaga = function * (action) {
    const {eventUid, personUid} = action.payload;
    const eventsRef = firebase.database().ref(`people/${personUid}/events`);
    const state = yield select(stateSelector);
    const events = state.getIn(['entities', personUid, 'events']).concat(eventUid);

    try {
        yield call([eventsRef, eventsRef.set], events);
        yield put({
            type: ADD_EVENT_SUCCESS,
            payload: {
                personUid,
                events
            }
        })
    }catch(_){
    }
}

export const saga = function * () {
    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        getPersonSaga(),
        takeEvery(ADD_EVENT_REQUEST, addEventSaga)
    ])
}
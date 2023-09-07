import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { AppState } from './state';
import { Action } from './actions';

export function createStore() {
    const store = configureStore<AppState, Action>({
        reducer: rootReducer
    });
    return store;
}

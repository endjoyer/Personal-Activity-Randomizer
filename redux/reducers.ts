import { combineReducers } from 'redux';
import sectionsReducer from './sectionsSlice';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  sections: sectionsReducer,
  auth: authReducer,
});

export default rootReducer;

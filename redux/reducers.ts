import { combineReducers } from 'redux';
import sectionsReducer from './sectionsSlice';

const rootReducer = combineReducers({
  sections: sectionsReducer,
});

export default rootReducer;

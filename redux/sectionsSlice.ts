import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface Section {
  id: string;
  name: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  name: string;
}

interface SectionsState {
  sections: Section[];
  selectedSection: string | null;
}

const initialState: SectionsState = {
  sections: [],
  selectedSection: null,
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<string>) => {
      state.sections.push({ id: uuidv4(), name: action.payload, activities: [] });
    },
    addActivity: (
      state,
      action: PayloadAction<{ sectionId: string; activityName: string }>
    ) => {
      const { sectionId, activityName } = action.payload;
      const section = state.sections.find((section) => section.id === sectionId);
      if (section) {
        section.activities.push({ id: uuidv4(), name: activityName });
      }
    },
    selectSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSection = action.payload;
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter((section) => section.id !== action.payload);
    },
    removeActivity: (
      state,
      action: PayloadAction<{ sectionId: string; activityId: string }>
    ) => {
      const { sectionId, activityId } = action.payload;
      const section = state.sections.find((section) => section.id === sectionId);
      if (section) {
        section.activities = section.activities.filter((activity) => activity.id !== activityId);
      }
    },
    renameSection: (
      state,
      action: PayloadAction<{ sectionId: string; newName: string }>
    ) => {
      const { sectionId, newName } = action.payload;
      const section = state.sections.find((section) => section.id === sectionId);
      if (section) {
        section.name = newName;
      }
    },
    renameActivity: (
      state,
      action: PayloadAction<{ sectionId: string; activityId: string; newName: string }>
    ) => {
      const { sectionId, activityId, newName } = action.payload;
      const section = state.sections.find((section) => section.id === sectionId);
      if (section) {
        const activity = section.activities.find((activity) => activity.id === activityId);
        if (activity) {
          activity.name = newName;
        }
      }
    },
    moveActivity: (
      state,
      action: PayloadAction<{ sectionId: string; fromIndex: number; toIndex: number }>
    ) => {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find((section) => section.id === sectionId);
      if (section) {
        const [removed] = section.activities.splice(fromIndex, 1);
        section.activities.splice(toIndex, 0, removed);
      }
    },
  },
});

export const {
  addSection,
  addActivity,
  selectSection,
  removeSection,
  removeActivity,
  renameSection,
  renameActivity,
  moveActivity,
} = sectionsSlice.actions;

export default sectionsSlice.reducer;


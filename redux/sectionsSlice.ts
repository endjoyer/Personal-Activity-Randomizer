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

const initialState: Section[] = [];

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<string>) => {
      state.push({ id: uuidv4(), name: action.payload, activities: [] });
    },
    addActivity: (
      state,
      action: PayloadAction<{ sectionId: string; activityName: string }>
    ) => {
      const { sectionId, activityName } = action.payload;
      const section = state.find((section) => section.id === sectionId);
      if (section) {
        section.activities.push({ id: uuidv4(), name: activityName });
      }
    },
  },
});

export const { addSection, addActivity } = sectionsSlice.actions;

export default sectionsSlice.reducer;

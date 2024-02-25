import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface Section {
  _id: string;
  name: string;
  activities: Activity[];
}

interface Activity {
  _id: string;
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

export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get('/api/sections');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для добавления нового раздела
export const addNewSection = createAsyncThunk(
  'sections/addNewSection',
  async (sectionName: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/sections', { name: sectionName });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для добавления новой активности в раздел
export const addNewActivity = createAsyncThunk(
  'sections/addNewActivity',
  async (
    { sectionId, activityName }: { sectionId: string; activityName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/api/sections/${sectionId}/activities`,
        { name: activityName }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для обновления раздела
export const updateSection = createAsyncThunk(
  'sections/updateSection',
  async (
    { sectionId, newName }: { sectionId: string; newName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/api/sections/${sectionId}`, {
        name: newName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для обновления активности в разделе
export const updateActivity = createAsyncThunk(
  'sections/updateActivity',
  async (
    {
      sectionId,
      activityId,
      newName,
    }: { sectionId: string; activityId: string; newName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/api/sections/${sectionId}/activities/${activityId}`,
        { name: newName }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для удаления раздела
export const deleteSection = createAsyncThunk(
  'sections/deleteSection',
  async (sectionId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/sections/${sectionId}`);
      return sectionId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Асинхронное действие для удаления активности из раздела
export const deleteActivity = createAsyncThunk(
  'sections/deleteActivity',
  async (
    { sectionId, activityId }: { sectionId: string; activityId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(
        `/api/sections/${sectionId}/activities/${activityId}`
      );
      return { sectionId, activityId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<string>) => {
      state.sections.push({
        _id: uuidv4(),
        name: action.payload,
        activities: [],
      });
    },
    addActivity: (
      state,
      action: PayloadAction<{ sectionId: string; activityName: string }>
    ) => {
      const { sectionId, activityName } = action.payload;
      const section = state.sections.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.activities.push({ _id: uuidv4(), name: activityName });
      }
    },
    selectSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSection = action.payload;
    },
    removeSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter(
        (section) => section._id !== action.payload
      );
    },
    removeActivity: (
      state,
      action: PayloadAction<{ sectionId: string; activityId: string }>
    ) => {
      const { sectionId, activityId } = action.payload;
      const section = state.sections.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.activities = section.activities.filter(
          (activity) => activity._id !== activityId
        );
      }
    },
    renameSection: (
      state,
      action: PayloadAction<{ sectionId: string; newName: string }>
    ) => {
      const { sectionId, newName } = action.payload;
      const section = state.sections.find(
        (section) => section._id === sectionId
      );
      if (section) {
        section.name = newName;
      }
    },
    renameActivity: (
      state,
      action: PayloadAction<{
        sectionId: string;
        activityId: string;
        newName: string;
      }>
    ) => {
      const { sectionId, activityId, newName } = action.payload;
      const section = state.sections.find(
        (section) => section._id === sectionId
      );
      if (section) {
        const activity = section.activities.find(
          (activity) => activity._id === activityId
        );
        if (activity) {
          activity.name = newName;
        }
      }
    },
    moveActivity: (
      state,
      action: PayloadAction<{
        sectionId: string;
        fromIndex: number;
        toIndex: number;
      }>
    ) => {
      const { sectionId, fromIndex, toIndex } = action.payload;
      const section = state.sections.find(
        (section) => section._id === sectionId
      );
      if (section) {
        const [removed] = section.activities.splice(fromIndex, 1);
        section.activities.splice(toIndex, 0, removed);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections = action.payload;
      })
      .addCase(addNewSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(
          (section) => section._id === action.payload._id
        );
        if (index !== -1) {
          state.sections[index] = action.payload;
        }
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter(
          (section) => section._id !== action.payload
        );
      })
      .addCase(addNewActivity.fulfilled, (state, action) => {
        const section = state.sections.find(
          (s) => s._id === action.meta.arg.sectionId
        );
        if (section) {
          section.activities.push(
            action.payload.activities[action.payload.activities.length - 1]
          );
        }
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const section = state.sections.find(
          (s) => s._id === action.meta.arg.sectionId
        );
        if (section) {
          const activityIndex = section.activities.findIndex(
            (a) => a._id === action.meta.arg.activityId
          );
          if (activityIndex !== -1) {
            section.activities[activityIndex] =
              action.payload.activities[activityIndex];
          }
        }
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        const section = state.sections.find(
          (s) => s._id === action.meta.arg.sectionId
        );
        if (section) {
          section.activities = section.activities.filter(
            (a) => a._id !== action.meta.arg.activityId
          );
        }
      });
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

import { ISection } from '@/models/Section';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { t } from 'i18next';
import { RootState } from './store';

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
  weightedRandom: boolean;
  sections: Section[];
  selectedSection: string | null;
  loading: boolean;
  usedActivities: number[];
  repeatActivities: boolean;
  isBulkAdd: boolean;
}

const createAllActivitiesSection = (sections: ISection[]) => {
  const allActivities = sections.flatMap((section) => section.activities);
  return {
    _id: 'all-activities',
    name: t('allActivities'),
    user: null,
    activities: allActivities,
  };
};

const initialState: SectionsState = {
  sections: [createAllActivitiesSection([])],
  selectedSection: null,
  loading: false,
  usedActivities: [] as number[],
  repeatActivities: false,
  weightedRandom: false,
  isBulkAdd: false,
};

// Получение разделов
export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get('/api/sections');
      const sections: ISection[] = response.data;
      const allActivitiesSection = createAllActivitiesSection(sections);
      return [allActivitiesSection, ...sections];
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Асинхронное действие для обновления раздела
export const updateNameSection = createAsyncThunk(
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateActivityOrder = createAsyncThunk(
  'sections/updateActivityOrder',
  async (
    {
      sectionId,
      orderedActivities,
    }: { sectionId: string; orderedActivities: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/api/sections/${sectionId}/activities/order`,
        {
          orderedActivities,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateSectionOrder = createAsyncThunk(
  'sections/updateSectionOrder',
  async (orderedSections: string[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const allActivitiesSection = state.sections.sections.find(
        (section) => section._id === 'all-activities'
      );
      const filteredSections = orderedSections.filter(
        (id) => id !== 'all-activities'
      );
      const response = await axios.put('/api/sections/order', {
        orderedSections: filteredSections,
      });
      const updatedSections = [allActivitiesSection, ...response.data.sections];
      return { sections: updatedSections };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    selectSection: (state, action: PayloadAction<string | null>) => {
      state.selectedSection = action.payload;
    },
    addSectionWithActivities: (state, action: PayloadAction<Section>) => {
      state.sections.push(action.payload);
    },
    updateAllActivitiesSectionName: (state, action: PayloadAction<string>) => {
      const allActivitiesSection = state.sections.find(
        (section) => section._id === 'all-activities'
      );
      if (allActivitiesSection) {
        allActivitiesSection.name = action.payload;
      }
    },
    updateSection: (state, action: PayloadAction<Section>) => {
      const updatedSection = action.payload;
      const index = state.sections.findIndex(
        (section) => section._id === updatedSection._id
      );
      if (index !== -1) {
        state.sections[index] = updatedSection;
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
    moveSection: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, removed);
    },
    toggleRepeatActivities: (state, action: PayloadAction<boolean>) => {
      state.repeatActivities = action.payload;
    },
    toggleWeightedRandom: (state, action: PayloadAction<boolean>) => {
      state.weightedRandom = action.payload;
    },
    addUsedActivity: (state, action: PayloadAction<number>) => {
      state.usedActivities.push(action.payload);
    },
    resetUsedActivities: (state) => {
      state.usedActivities = [];
      state.isBulkAdd = false;
    },
    toggleBulkAdd: (state) => {
      state.isBulkAdd = !state.isBulkAdd;
    },
    setBulkAdd: (state, action: PayloadAction<boolean>) => {
      state.isBulkAdd = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.sections = action.payload;
        state.loading = false;
      })
      .addCase(fetchSections.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addNewSection.fulfilled, (state, action) => {
        state.sections.push(action.payload);
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

        const sectionAllActivity = state.sections.find(
          (s) => s._id === 'all-activities'
        );
        if (sectionAllActivity) {
          sectionAllActivity.activities.push(
            action.payload.activities[action.payload.activities.length - 1]
          );
        }
      })
      .addCase(updateNameSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(
          (section) => section._id === action.payload._id
        );
        if (index !== -1) {
          state.sections[index] = action.payload;
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

        const sectionAllActivity = state.sections.find(
          (s) => s._id === 'all-activities'
        );
        if (sectionAllActivity) {
          sectionAllActivity.activities = sectionAllActivity.activities.filter(
            (a) => a._id !== action.meta.arg.activityId
          );
        }
      })
      .addCase(updateActivityOrder.fulfilled, (state, action) => {
        const sectionIndex = state.sections.findIndex(
          (section) => section._id === action.meta.arg.sectionId
        );
        if (sectionIndex !== -1) {
          state.sections[sectionIndex].activities = action.payload.activities;
        }
      })
      .addCase(updateSectionOrder.fulfilled, (state, action) => {
        state.sections = action.payload.sections;
      });
  },
});

export const {
  addSectionWithActivities,
  updateAllActivitiesSectionName,
  updateSection,
  toggleRepeatActivities,
  toggleWeightedRandom,
  addUsedActivity,
  resetUsedActivities,
  selectSection,
  moveActivity,
  moveSection,
  toggleBulkAdd,
  setBulkAdd,
} = sectionsSlice.actions;

export default sectionsSlice.reducer;

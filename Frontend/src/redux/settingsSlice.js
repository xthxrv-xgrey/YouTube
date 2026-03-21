import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  language: "en",
  notifications: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
  },
});

export const { toggleTheme, setLanguage, toggleNotifications } =
  settingsSlice.actions;

export default settingsSlice.reducer;

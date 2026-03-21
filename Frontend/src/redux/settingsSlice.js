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
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
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

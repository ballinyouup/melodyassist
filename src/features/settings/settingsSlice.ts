import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteLoading: false,
  editUsername: false,
  editUsernameLoading: false,
  newUsername: "",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setDeleteLoading: (state, action) => {
      switch (action.type) {
        case "DELETE_LOADING_FALSE":
          state.deleteLoading = false;
        case "DELETE_LOADING_TRUE":
          state.deleteLoading = true;
        default:
          return state;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = settingsSlice.actions;

export default settingsSlice.reducer;

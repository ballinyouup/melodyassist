import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { z } from "zod";
import { api } from "~/utils/api";

const userData = api.account.getUserData.useQuery();

const initialState = {
  email: userData.data?.email,
  emailVerified: userData.data?.emailVerified,
  id: userData.data?.id,
  image: userData.data?.image,
  name: userData.data?.name,
  role: userData.data?.role,
  theme: userData.data?.theme,
  userName: userData.data?.userName,
  deleteLoading: false,
  editUsername: false,
  editUsernameLoading: false,
  newUsername: "",
};
const userNameSchema = z.string().min(4).max(24);
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

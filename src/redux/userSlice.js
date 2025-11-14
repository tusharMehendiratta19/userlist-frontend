import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  name: null,
  email: null,
  loginTime: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { userId, name, email, token } = action.payload;
      state.userId = userId;
      state.name = name;
      state.loginTime = new Date().toLocaleString();
    },
    clearUserData: (state) => {
      state.userId = null;
      state.name = null;
      state.loginTime = null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;

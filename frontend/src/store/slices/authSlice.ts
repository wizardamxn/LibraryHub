import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { addUser, logout } = authSlice.actions;
export default authSlice.reducer;

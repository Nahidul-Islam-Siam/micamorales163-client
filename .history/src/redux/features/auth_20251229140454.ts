import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  id: string;
  email: string;
  exp: number;
  iat: number;
  role: string;
  userId: string;
  firstName: string;
  lastName: string;
  accessToken: string;
};
interface AuthSate {
  user: UserType | null;
  access_token: string | null;
  refresh_token: string | null;
  isLoading?: boolean;
}

const initialState: AuthSate = {
  user: null,
  access_token: null,
  refresh_token: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        user: UserType | null;
        access_token: string | null;
        refresh_token: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.isLoading = false;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    setAccessToken(state, action: { payload: string | null }) {
      state.access_token = action.payload;
    },
    setRefreshToken(state, action: { payload: string | null }) {
      state.refresh_token = action.payload;
    },
    setIsLoading(state, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.oken = null;
      // Remove the "roll" cookie
      document.cookie =
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie =
        "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      // redirect user
      window.location.href = "/";
    },
  },
});

export const {
  setUser,
  setAccessToken,
  setIsLoading,
  logout,
  setRefreshToken,
} = authSlice.actions;

export default authSlice.reducer;

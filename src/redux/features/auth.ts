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
  username:string;
};
interface AuthSate {
  user: UserType | null;
  token: string | null;
  refreshToken: string | null;
  isLoading?: boolean;
}

const initialState: AuthSate = {
  user: null,
  token: null,
  refreshToken: null,
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
        token: string | null;
        refreshToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.isLoading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccessToken(state, action: { payload: string | null }) {
      state.token = action.payload;
    },
    setRefreshToken(state, action: { payload: string | null }) {
      state.token = action.payload;
    },
    setIsLoading(state, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
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

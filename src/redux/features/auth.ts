import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  id: string;
  username: string;
  email: string;
  description: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  location: string | null;
  contactNo: string | null;
  avatars: string | null;
  status: string;
  role: string;
  lang: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Note: token is NOT part of user — it's separate
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

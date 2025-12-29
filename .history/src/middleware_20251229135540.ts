/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  // console.log("Token from cookies: ", token);

  // Redirect to login if token is not present
  if (!token || typeof token !== "string") {
    const loginUrl = new URL("/signin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode the token
    const decodedToken: any = jwtDecode(token);
    // console.log("Decoded Token: ", decodedToken);

    // Ensure the token has a valid email and role
    if (!decodedToken.email) {
      //   console.log("Token missing email or role");

        const loginUrl = new URL("/signin", request.url);
      return NextResponse.redirect(loginUrl);
          
      
    }
    // Proceed to the requested route
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token or error during decoding:", error);
    const loginUrl = new URL("/signin", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  // matcher: [ "/profile","/dashboard/admin/:path*"],

  matcher: [ "/dashboard/:path*","/clinic-dashboard/:path*","/dashboard/admin/:path*"],
};
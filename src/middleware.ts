import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// import envConfig from './configs/envConfig';
import { PUBLIC_ROUTES } from "./lib/utils";

// import { HttpResponse } from './types/types';

import type { NextRequest } from "next/server";
// Danh sách các public routes

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  if (PUBLIC_ROUTES.includes(pathname) && pathname !== "/login") {
    return NextResponse.next();
  }
  if (!refreshToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (refreshToken && pathname == "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // if (refreshToken) {
  //     const response = await fetch(
  //         `${envConfig.BACKEND_URL}/auth/check-token`,
  //         {
  //             method: "POST",
  //             headers: {
  //                 Authorization: `Bearer ${refreshToken}`,
  //                 "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //                 token: refreshToken,
  //             }),
  //         }
  //     );

  //     const data: HttpResponse = await response.json();
  //     if (data.code !== 200) {
  //         (await cookieStore).delete("refreshToken");
  //         return NextResponse.redirect(new URL("/login", request.url));
  //     }
  //     return NextResponse.next();
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

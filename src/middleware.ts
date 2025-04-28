import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các public routes
const PUBLIC_ROUTES = ["/login", "/register", "/auth/google-callback"];
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get("refreshToken");
    if (PUBLIC_ROUTES.includes(pathname) && pathname !== "/login") {
        return NextResponse.next();
    }

    if (!refreshToken && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (refreshToken && pathname == "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

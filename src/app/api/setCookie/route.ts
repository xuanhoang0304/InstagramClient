import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { accessToken, refreshToken } = await request.json();
    const res = NextResponse.json({ success: true });

    if (accessToken) {
        res.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 15,
            path: "/",
        });
    }

    if (refreshToken) {
        res.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 24 * 7, // 7 ngày
            path: "/",
        });
    }

    return res;
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const nextUrl = request.nextUrl.clone();

    const flash_message = nextUrl.searchParams.get("flash_message");

    const response = NextResponse.rewrite(nextUrl);

    if (flash_message) {
        response.cookies.set("flash_message", "NO_SESSION", {
            httpOnly: true,
            secure: false,
            maxAge: 2, // One week
            path: '/',
        })
    }

    return response
}

export const config = {
    // matcher solution for public, api, assets and _next exclusion
    matcher: "/((?!api|static|.*\\..*|_next).*)",
};

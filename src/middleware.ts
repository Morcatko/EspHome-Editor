import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

//Middleware to fix wrong url of codicon font (Monaco-editor)
export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname.replace('/_next/static/css/_next/static/', '/_next/static/');
    const newUrl = new URL(pathName, request.url)
    return NextResponse.rewrite(newUrl);
}

export const config = {
    matcher: '/_next/static/css/_next/static/:path*',
}